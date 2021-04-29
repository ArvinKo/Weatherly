getData();

//function that retrieves the information from a databse and outputs it onto history.html
async function getData() {
  const response = await fetch("/api");
  const data = await response.json();

  //loops through the database and outputs its information onto history.html
  for (item of data) {
    const root = document.createElement("p");
    const name = document.createElement("div");
    const temp = document.createElement("div");
    const humid = document.createElement("div");
    const desc = document.createElement("div");
    const time = document.createElement("div");

    name.textContent = `City: ${item.name}`;
    temp.textContent = `Temperature: ${item.temp}°C`;
    desc.textContent = `Description: ${item.desc}`;
    humid.textContent = `Humidity: ${item.humid}%`;
    const date = new Date(item.time).toLocaleString();
    time.textContent = date;

    root.append(name, temp, humid, desc, time);
    document.body.append(root);
  }
}
