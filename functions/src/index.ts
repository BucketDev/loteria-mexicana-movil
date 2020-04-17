import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  return admin.firestore().doc(`/users/${userRecord.uid}`).set({
    displayName: userRecord.displayName === null ? userRecord.email : userRecord.displayName,
    email: userRecord.email,
    photoURL: userRecord.photoURL === null ? 'https://img.icons8.com/bubbles/256/gender-neutral-user' : userRecord.photoURL,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,
    otherPlaces: 0,
    friendsRef: [],
    friends: [],
    creationDate: new Date()
  });
});

exports.sendInvitePlayers = functions.firestore.document('users/{uid}/boards/{boardUid}/players/{playerUid}')
  .onCreate((snap, context) => {
    const userRef = admin.firestore().collection('/users').doc(context.params.uid);
    return userRef.get().then(userDocument => {
      const userData = userDocument.data();
      if (userData === undefined) {
        console.error("User does not exists");
        return null;
      }
      return userRef.collection('/boards').doc(context.params.boardUid).get()
        .then(boardDocument => {
          const boardData = boardDocument.data();
          if (boardData === undefined) {
            console.error("Board does not exists");
            return null;
          }
          const notification = {
            photoURL: userData.photoURL,
            pre: userData.displayName,
            message: "te ha invitado a jugar",
            post: boardData.title,
            creationDate: new Date(),
            clicked: false,
            actionURL: `/board/${context.params.uid}/${context.params.boardUid}`
          };
          const playerRef = admin.firestore().collection('/users').doc(context.params.playerUid);
          return playerRef.get()
            .then(playerDocument => {
              return playerRef.collection('notifications').add({...notification})
                .then(playerUpdated => {
                  // @ts-ignore
                  const {fcmTokens} = playerDocument.data();
                  const {uid, boardUid} = context.params;
                  const tokens = fcmTokens ? Object.keys(fcmTokens) : [];
                  if (!tokens.length) {
                    console.error("User does not have any tokens");
                    return null;
                  }
                  const payload = {
                    notification: {
                      title: '¡Corre y se va corriendo!',
                      body: `${userData.displayName} te ha invitado a jugar Lotería Mexicana`
                    },
                    data: { userUid: uid, boardUid }
                  };
                  return admin.messaging().sendToDevice(tokens, payload).catch(console.error)
                })
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error)
    }).catch(console.error);
  });