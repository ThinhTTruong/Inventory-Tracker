// Function that runs when the page is loaded
function init(){
    document.getElementById("add-button").addEventListener("click", addItem);
    document.getElementById("filter-button").addEventListener("click", filterItems);
    showItems();
}

// Add an item with input fields to database
function addItem() {
    const itemId = document.getElementById("add-itemId").value;
    const name = document.getElementById("add-name").value;
    const category = document.getElementById("add-category").value;
    const quantity = document.getElementById("add-quantity").value;
    const warehouse = document.getElementById("add-warehouse").value;
    document.getElementById('add-error').style.display = '';

    if (itemId && name && category && quantity && !isNaN(quantity) && warehouse) {
        fetch("/items", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ itemId, name, category, quantity, warehouse }),
        }).catch(err => console.log(err));
        clearAddFields();
        showItems();
    } else {
        document.getElementById('add-error').style.display = 'block';
    }
}

// Filter items that match input fields
function filterItems() {
    const itemId = document.getElementById("filter-itemId").value;
    const name = document.getElementById("filter-name").value;
    const category = document.getElementById("filter-category").value;
    const quantity = document.getElementById("filter-quantity").value;
    const warehouse = document.getElementById("filter-warehouse").value;
    const filter = { itemId, name, category, quantity, warehouse };
    showItems(filter);
    Object.values(filter).forEach(field => field.value="");
}

// Get items and display on screen
function showItems(filter) {
    let query = "";

    if (filter){
        Object.entries(filter).forEach(([key, value]) => {
            query += `${key}=${value}&`;
        })
    }
    fetch(`/items?${query}`, {method: 'GET'})
        .then(res => res.json())
        .then(data => renderItems(data)) 
        .catch(err => console.log(err));
}

// Display given items on screen
function renderItems(items) {
    const fields = ['itemId', 'name', 'category', 'quantity', 'warehouse'];
    document.getElementById("items").innerHTML="";
    let result = "";
    items.forEach((item)=> {
        result += `<tr id="item-${item._id}">`;
        Object.values(fields).forEach(value => {
            result += `<td><input name="${value}" value="${item[value]}" readonly /></td>`;
        })
        result += 
            `<td>
                <button id="update-${item._id}" class="update-button" onclick="updateItem('${item._id}')">Update</button>
                <button class="edit-button" onclick="editItem('${item._id}')">Edit</button>
                <button onclick="deleteItem('${item._id}')">Delete</button>
            </td>
            </tr>`
    })
    document.getElementById("items").innerHTML=result;
}

// Delete an item with given id
function deleteItem(id){
    fetch(`/items/${id}`, {method: 'DELETE'})
        .then(() => showItems());

}

// Allow to edit an item with given id
function editItem(id) {
    const item = document.getElementById(`item-${id}`);
    const itemFields = item.getElementsByTagName("input");
    Array.from(itemFields).forEach(field => field.readOnly = false);
    document.getElementById(`update-${id}`).style.display = "block";
}

// Update an item with given id
function updateItem(id) {
    const item = document.getElementById(`item-${id}`);
    const itemFields = item.getElementsByTagName("input");
    let updatedItem = {};
    Array.from(itemFields).forEach(field=>{
        updatedItem[field.name] = field.value;
    })
    fetch(`/items/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedItem),
      }).catch(err => console.log(err));
    document.getElementById(`update-${id}`).style.display = "none";
    Array.from(itemFields).forEach(field => field.readOnly = true);
}

// Clear all the add input fields
function clearAddFields() {
    document.getElementById("add-itemId").value = "";
    document.getElementById("add-name").value = "";
    document.getElementById("add-category").value = "";
    document.getElementById("add-quantity").value = "";
    document.getElementById("add-warehouse").value = "";
}
