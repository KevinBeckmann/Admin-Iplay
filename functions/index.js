const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyNewOrder = onDocumentCreated("pedidos/{pedidoId}", async (event) => {
  const pedido = event.data?.data();
  if (!pedido) return;

  const nome = pedido.nome || "Cliente";
  const total = pedido.total || 0;

  const snap = await admin.firestore().collection("adminTokens").get();
  const tokens = snap.docs.map(d => d.data().token).filter(Boolean);

  if (!tokens.length) return;

  const message = {
    notification: {
      title: "Novo pedido recebido",
      body: `${nome} • Total R$ ${total}`
    },
    tokens
  };

  const resp = await admin.messaging().sendEachForMulticast(message);

  // limpa tokens inválidos
  const invalid = [];
  resp.responses.forEach((r, i) => {
    if (!r.success) invalid.push(tokens[i]);
  });

  if (invalid.length) {
    const batch = admin.firestore().batch();
    invalid.forEach(t => batch.delete(admin.firestore().collection("adminTokens").doc(t)));
    await batch.commit();
  }
});
