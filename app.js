// jshint esversion:6

// Require necessary modules
const express = require("express"); // Express.js framework
const bodyParser = require("body-parser"); // Middleware to parse request bodies
const mongoose = require("mongoose"); // MongoDB object modeling tool
const _ = require("lodash"); // Utility library for JavaScript

// Create an Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for individual todo list items
const itemsSchema = {
  name: String
};

// Create a Mongoose model based on the items schema
const Item = mongoose.model("Item", itemsSchema);

// Default items to be inserted into the database if no items exist
const defaultItems = [
  { name: "Welcome to your todolist!" },
  { name: "Hit the + button to add a new item." },
  { name: "<-- Hit this to delete an item." }
];

// Define the schema for todo lists
const listSchema = {
  name: String,
  items: [itemsSchema]
};

// Create a Mongoose model based on the list schema
const List = mongoose.model("List", listSchema);

// Route to handle requests to the root URL
app.get("/", function (req, res) {
  // Find all items in the Item collection
  Item.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
      return;
    }
    // If no items found, insert default items and redirect to the root URL
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      // If items found, render the 'list' view with found items
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

// Route to handle requests to custom todo lists
app.get("/:customListName", function (req, res) {
  // Extract custom list name from request parameters and capitalize it
  const customListName = _.capitalize(req.params.customListName);
  // Find a list with the provided name
  List.findOne({ name: customListName }, function (err, foundList) {
    if (err) {
      console.log(err);
      return;
    }
    // If no list found, create a new list with default items and redirect
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      // If list found, render the 'list' view with list title and items
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  });
});

// Route to handle adding new items to todo lists
app.post("/", function (req, res) {
  const itemName = req.body.newItem; // Extract new item name from request body
  const listName = req.body.list; // Extract list name from request body

  // Create a new Item instance with the provided name
  const item = new Item({
    name: itemName
  });

  // If the list is "Today", save the item and redirect to the root URL
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    // Find the list with the provided name and push the new item to its items array
    List.findOne({ name: listName }, function (err, foundList) {
      if (err) {
        console.log(err);
        return;
      }
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Route to handle deleting items from todo lists
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox; // Extract ID of item to be deleted
  const listName = req.body.listName; // Extract name of the list containing the item

  // If the list is "Today", delete the item by ID and redirect to the root URL
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    });
  } else {
    // If the list is custom, find the list and pull the item from its items array
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (err) {
        console.log(err);
        return;
      }
      res.redirect("/" + listName);
    });
  }
});

// Route to render the 'about' page
app.get("/about", function (req, res) {
  res.render("about");
});

// Start the server and listen on port 3000
app.listen(3000, function () {
  console.log("Server started on port http://localhost:3000");
});












// ORIGINAL CODE WHICH IS NOT RUNNING ANYMORE----------------->

//jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const _ = require("lodash");

// const app = express();

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// const itemsSchema = {
//   name: String
// };

// const Item = mongoose.model("Item", itemsSchema);


// const item1 = new Item({
//   name: "Welcome to your todolist!"
// });

// const item2 = new Item({
//   name: "Hit the + button to add a new item."
// });

// const item3 = new Item({
//   name: "<-- Hit this to delete an item."
// });

// const defaultItems = [item1, item2, item3];

// const listSchema = {
//   name: String,
//   items: [itemsSchema]
// };

// const List = mongoose.model("List", listSchema);


// app.get("/", function(req, res) {

//   Item.find({}, function(err, foundItems){

//     if (foundItems.length === 0) {
//       Item.insertMany(defaultItems, function(err){
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Successfully savevd default items to DB.");
//         }
//       });
//       res.redirect("/");
//     } else {
//       res.render("list", {listTitle: "Today", newListItems: foundItems});
//     }
//   });

// });

// app.get("/:customListName", function(req, res){
//   const customListName = _.capitalize(req.params.customListName);

//   List.findOne({name: customListName}, function(err, foundList){
//     if (!err){
//       if (!foundList){
//         //Create a new list
//         const list = new List({
//           name: customListName,
//           items: defaultItems
//         });
//         list.save();
//         res.redirect("/" + customListName);
//       } else {
//         //Show an existing list

//         res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//       }
//     }
//   });



// });

// app.post("/", function(req, res){

//   const itemName = req.body.newItem;
//   const listName = req.body.list;

//   const item = new Item({
//     name: itemName
//   });

//   if (listName === "Today"){
//     item.save();
//     res.redirect("/");
//   } else {
//     List.findOne({name: listName}, function(err, foundList){
//       foundList.items.push(item);
//       foundList.save();
//       res.redirect("/" + listName);
//     });
//   }
// });

// app.post("/delete", function(req, res){
//   const checkedItemId = req.body.checkbox;
//   const listName = req.body.listName;

//   if (listName === "Today") {
//     Item.findByIdAndRemove(checkedItemId, function(err){
//       if (!err) {
//         console.log("Successfully deleted checked item.");
//         res.redirect("/");
//       }
//     });
//   } else {
//     List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
//       if (!err){
//         res.redirect("/" + listName);
//       }
//     });
//   }


// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });