import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import UserRecord = admin.auth.UserRecord;

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  const userInfo = getUserInfo(userRecord);
  return admin.firestore().doc(`/users/${userRecord.uid}`).set({
    displayName: userInfo.displayName,
    email: userInfo.email,
    photoURL: userInfo.photoURL,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,
    otherPlaces: 0,
    friendsRef: [],
    friends: [],
    creationDate: new Date()
  });
});

const getUserInfo = (userRecord: UserRecord): {email: string, displayName: string, photoURL: string} => {
  const providerData = userRecord.providerData[0];
  const userInfo = { displayName: '', email: '', photoURL: '' };
  switch (providerData.providerId) {
    case 'password':
      userInfo.email = providerData.email;
      userInfo.displayName = providerData.email;
      userInfo.photoURL = 'https://img.icons8.com/bubbles/256/gender-neutral-user';
      break;
    case  'facebook.com':
    case 'google.com':
      userInfo.email = providerData.email;
      userInfo.displayName = providerData.displayName;
      userInfo.photoURL = providerData.photoURL;
      break;
  }
  return userInfo;
}

exports.sendInvitePlayers = functions.firestore.document('users/{uid}/boards/{boardUid}/players/{playerUid}')
  .onCreate((snap, context) => {
    // the player is the creator, there's no need to send an invite
    if (context.params.uid === context.params.playerUid) {
      return null;
    }
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
              // @ts-ignore
              return playerRef.collection('notifications').add({...notification}).then(() => {
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

exports.increasePlayersTotal = functions.firestore.document('users/{userUid}/boards/{boardUid}/players/{playerUid}')
  .onCreate((snapshot, context) => updatePlayersTotal(snapshot))

exports.decreasePlayersTotal = functions.firestore.document('users/{userUid}/boards/{boardUid}/players/{playerUid}')
  .onDelete((snapshot, context) => updatePlayersTotal(snapshot))

const updatePlayersTotal = (snapshot: DocumentSnapshot) => {
  const collection = snapshot.ref.parent;
  if (collection) {
    const boardRef = collection.parent;
    if (boardRef !== null) {
      return collection.listDocuments().then((documents) =>
        boardRef.update({ players: documents.length })).catch(console.error);
    }
  }
  return null;
}

exports.updateWinningResult = functions.firestore.document('users/{userUid}/boards/{boardUid}/winners/{winnerUid}')
  .onCreate((snapshot, context) => {
    const userRef = admin.firestore().collection('/users').doc(context.params.winnerUid);
    const collection = snapshot.ref.parent;
    if (userRef !== null) {
      // @ts-ignore
      return userRef.get().then((userDocument) => {
          const userData = userDocument.data();
          if (userData !== undefined) {
            return collection.listDocuments().then(documents => {
              switch (documents.length) {
                case 1:
                  return userRef.update({firstPlaces: userData.firstPlaces + 1}).catch(console.error);
                case 2:
                  return userRef.update({secondPlaces: userData.secondPlaces + 1}).catch(console.error);
                case 3:
                  return userRef.update({thirdPlaces: userData.thirdPlaces + 1}).catch(console.error);
                default:
                  return userRef.update({otherPlaces: userData.otherPlaces + 1}).catch(console.error);
              }
            })
          }
          return null;
        })
        .catch(console.error);
    }
    throw new Error('User not found');
  })
