const datab = firebase.firestore();

// datab.collection('User Data').get()
//     .then((snapshot) => {
//         snapshot.docs.forEach(doc => {
//             console.log(doc.id);
//         })
//     })
//     .catch((e => {
//         console.log(e);
//     }))
// datab.collection('Users').add({
//     'Name': 'Hello'
// }).catch(
//     (e) => {console.log(e)}
// )
// datab.collection('Users').doc('Temp').set({
//     "Name": "Temp"
// })