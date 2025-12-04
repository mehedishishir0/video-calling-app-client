// class PeerService {
//     constructor(){
//         if(!this.peer){
//             this.peer = new RTCPeerConnection({
//                 iceServers:[
//                     {
//                         urls:[
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478"
//                         ]
//                     }
//                 ]
//             });
//         }
//     }
//    async getAnswer(offer){
//         if(this.peer){
//             await this.peer.setRemoteDescription(offer);
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             return answer;
//         }
//     }

//     async setLocalDescription(answer){
//         if(this.peer){
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//         }
//     }

//     async getOffer(){
//         if(this.peer){
//             const offer = await this.peer.createOffer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             return offer;
//         }
//     }
// }

// export default new PeerService();

class PeerService {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  // Add Track First (VERY IMPORTANT)
  async addStream(stream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }

  // Caller side: Create Offer
  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  // Receiver side: Answer creation
  async getAnswer(offer) {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  // Caller side: Set remote answer
  async setRemoteAnswer(answer) {
    if (this.peer.signalingState === "have-local-offer") {
      await this.peer.setRemoteDescription(answer);
    } else {
      console.warn("Ignoring answer, wrong state:", this.peer.signalingState);
    }
  }
}

export default new PeerService();
