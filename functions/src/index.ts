import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import DocumentData = admin.firestore.DocumentData;

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  console.log(userRecord.displayName);
  console.log(userRecord.photoURL);
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
            console.log(context.params);
            console.log(context.params.boardUid)
            console.error("Board does not exists");
            return null;
          }
          const notification = {
            photoURL: 'https://img.icons8.com/bubbles/64/controller',
            pre: userData.displayName ? userData.displayName : userData.email,
            message: "te ha invitado a jugar",
            post: boardData.title,
            creationDate: new Date(),
            clicked: false,
            actionURL: `/board/${context.params.uid}/${context.params.boardUid}`
          };
          return createNotification(context.params.playerUid, notification);
        })
        .catch(console.error)
    }).catch(console.error);
  });

exports.friendAdded = functions.firestore.document('users/{uid}/friends/{friendUid}')
  .onCreate((snapshot, context) => {
    const userRef = admin.firestore().collection('users').doc(context.params.uid);
    return userRef.get()
      .then(userDocument => {
        const userData = userDocument.data();
        if (userData === undefined) {
          console.error("User does not exists");
          return null;
        }
        const notification = {
          photoURL: userData.photoURL ? userData.photoURL : 'https://img.icons8.com/bubbles/gender-neutral-user',
          pre: userData.displayName ? userData.displayName : userData.email,
          message: "te ha agregado como amigo",
          creationDate: new Date(),
          clicked: false,
          actionURL: `/profile/${context.params.friendUid}`
        }
        return createNotification(context.params.friendUid, notification);
      }).catch(console.error);
  });

const createNotification = (friendUid: string, notification: any) => {
  const playerRef = admin.firestore().collection('/users').doc(friendUid);
  return playerRef.get()
    .then(playerDocument => {
      return playerRef.collection('notifications').add({...notification})
        .then(() => {
          sendToDevice(playerDocument)
        })
        .catch(console.error);
    })
    .catch(console.error);
}

const sendToDevice = (document: DocumentSnapshot<DocumentData>) => {
  // @ts-ignore
  const {fcmTokens} = document.data();
  const payload = {
    notification: {
      title: 'A new board has being created!',
      body: 'Tap here to play'
    }
  };
  if (!fcmTokens.length) {
    console.error("User does not have any tokens");
    return null;
  }
  return admin.messaging().sendToDevice(fcmTokens, payload).catch(console.error)
}
