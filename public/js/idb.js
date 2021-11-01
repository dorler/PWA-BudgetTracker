let db;

const request = indexDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("updatedBalance", { autoincrement: true });
};

request.onsuccess = function (event) {
  const db = event.target.result;
  if (navigator.onLine) {
    uploadBalance();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["updatedBalance", "readwrite"]);
  const balanceObjectStore = transaction.objectStore("updatedBalance");

  balanceObjectStore.add(record);
}
function uploadBalance() {
  const transaction = db.transaction(["updatedBalance"], "readwrite");
  const balanceObjectStore = transaction.objectStore("updatedBalance");
  const getAll = balanceObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["updatedBalance"], "readwrite");
          const balanceObjectStore = transaction.objectStore("updatedBalance");

          balanceObjectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadBalance);
