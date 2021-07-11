<template>
  <div id="home-panel">
    <side-bar
      v-bind:workspaceId="workspaceId"
      v-bind:selectedChannel="selectedChannel"
      v-bind:connectionStatus="connectionStatus"
      v-bind:peers="peers"
    ></side-bar>
    <chat-panel></chat-panel>
  </div>
</template>

<script>
import SideBar from "./SideBar";
import ChatPanel from "./ChatPanel";
import Immutable from "immutable";

export default {
  name: "Home",
  components: {
    SideBar,
    ChatPanel,
  },
  mounted() {
    (async () => {
      console.log("Init IPFS: ", this.workspaceId);
      this.ipfs = await window.Ipfs.create({
        repo: this.workspaceId + Math.random(), // random so we get a new peerid every time, useful for testing
        relay: {
          enabled: true,
          hop: {
            enabled: true,
          },
        },
        config: {
          Addresses: {
            Swarm: [
              "/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
              "/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
            ],
          },
          // FIXME Announce: [ '/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt/p2p-circuit' ],
        },
      });
      window.ipfs = this.ipfs;
      console.log("Setup IPFS");

      // add bootstraps for next time, and attempt connection just in case we're not already connected
      await this.dobootstrap(false);

      // join selected channel
      await this.joinChannel(this.selectedChannel);

      // publish and subscribe to keepalive to help keep the sockets open
      const keepAliveChannel = this.workspaceId + "-keepalive";
      await this.ipfs.pubsub.subscribe(keepAliveChannel);
      console.log(`Subscribed to ${keepAliveChannel} channel`);
      const keepAlive = async () => {
        await this.ipfs.pubsub.publish(keepAliveChannel, "1");
      };
      setInterval(keepAlive, 4000);
      keepAlive();
      setInterval(this.checkAlive, 1000);

      // process announcements over the relay network, and publish our own keep-alives to keep the channel alive
      const announceChannel = "announce-circuit"; // this.workspaceId + "-announce-circuit";
      await this.ipfs.pubsub.subscribe(announceChannel, this.processAnnounce);
      console.log(`Subscribed to ${announceChannel} channel`);
      const peerAlive = async () => {
        await this.ipfs.pubsub.publish(announceChannel, this.peerAliveMessage);
      };
      setInterval(peerAlive, 15000);
      peerAlive();

      window.home = this;
    })();
  },
  data() {
    return {
      peers: Immutable.Set(),
      lastAlive: 0, // last keep-alive we saw from a relay
      lastPeer: 0, // last keep-alive we saw from another peer
      lastBootstrap: 0, // last keep-alive we saw from another peer
      bootstraps: [
        "/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
        "/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
      ],
      workspaceId: "myobu-chat",
      selectedChannel: "general",
      connectionStatus: "NO_PEERS", // RELAY | DIRECT_PEERS | NO_PEERS
      ipfs: null, // Ipfs instance
      cleanPeerTimeout: {},
    };
  },
  computed: {
    peerAliveMessage() {
      return this.workspaceId + "-peer-alive";
    },
  },
  methods: {
    // check if we're still connected to the circuit relay (not required, but let's us know if we can see peers who may be stuck behind NAT)
    checkAlive() {
      const now = new Date().getTime();
      if (now - this.lastAlive >= 35000) {
        if (now - this.lastPeer >= 35000) {
          this.connectionStatus = "NO_PEERS";
        } else {
          this.connectionStatus = "DIRECT_PEERS";
        }
        this.dobootstrap(true); // sometimes we appear to be connected to the bootstrap nodes, but we're not, so let's try to reconnect
      } else {
        this.connectionStatus = "RELAY";
      }
    },

    // processes a circuit-relay announce over pubsub
    async processAnnounce(message) {
      // get our peerid
      const me = (await this.ipfs.id()).id;
      // console.log("processAnnounce: ", message, me);
      // console.log("processAnnouce data: ", data);

      // not really an announcement if it's from us
      if (message.from == me) {
        return;
      }

      // process the recieved address
      const data = new TextDecoder().decode(message.data);

      if (data === "peer-alive") {
        return; // Might receive other peers that don't belong to this app
      }

      if (data == this.peerAliveMessage) {
        this.peers = this.peers.add(message.from);
        clearTimeout(this.cleanPeerTimeout[message.from]);
        this.cleanPeerTimeout[message.from] = setTimeout(() => {
          this.peers = this.peers.delete(message.from);
        }, 15000);

        this.lastPeer = new Date().getTime();
        return;
      }

      // keep-alives are also sent over here, so let's update that global first
      this.lastAlive = new Date().getTime();

      if (data == "keep-alive") {
        // keep-alive is sent from circuit server
        // console.log(message.from, data);
        return;
      }

      const peer = data.split("/")[9];
      const swarmAddress = data;
      // console.log("Peer: " + peer);
      // console.log("Me: " + me);
      if (peer == me) {
        return;
      }

      // get a list of peers
      const peers = await this.ipfs.swarm.peers();
      for (const i in peers) {
        // if we're already connected to the peer, don't bother doing a circuit connection
        if (peers[i].peer == peer) {
          return;
        }
      }
      // log the address to console as we're about to attempt a connection
      // console.log(swarmAddress);

      // connection almost always fails the first time, but almost always succeeds the second time, so we do this:
      try {
        await this.ipfs.swarm.connect(swarmAddress);
      } catch (err) {
        console.error(err);
        await this.ipfs.swarm.connect(swarmAddress);
      }
    },

    // if reconnect is true, it'll first attempt to disconnect from the bootstrap nodes
    async dobootstrap(reconnect) {
      const now = new Date().getTime();
      if (now - this.lastBootstrap < 60000) {
        // don't try to bootstrap again if we just tried within the last 60 seconds
        return;
      }
      this.lastBootstrap = now;
      for (const i in this.bootstraps) {
        if (reconnect) {
          try {
            await this.ipfs.swarm.disconnect(this.bootstraps[i]);
          } catch (e) {
            console.error(e);
          }
        } else {
          await this.ipfs.bootstrap.add(this.bootstraps[i]);
        }
        await this.ipfs.swarm.connect(this.bootstraps[i]);
      }
    },

    async joinChannel(channel) {
      await this.ipfs.pubsub.subscribe(
        this.workspaceId + "-" + channel,
        this.out
      );
    },

    // out is used for processing recieved messages and outputting them both to console and the message box.
    out(msg) {
      msg = new TextDecoder().decode(msg.data);
      console.log(msg);
    },
  },
};
</script>

<style scoped>
#home-panel {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
</style>