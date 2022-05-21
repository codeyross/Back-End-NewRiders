const express = require("express");
const router = express.Router();
const Day = require("../models/day-model");


function getTodaysDate() {
  let today = new Date();
  let year = today.getFullYear();
  year = year.toString();
  let month = today.getMonth();
  month = month + 1;
  month = month.toString();
  let day = today.getDate();
  day = day.toString();
 
  let date = `${month}/${day}/${year}`;
  return date;
}

router.get("/", (req, res, next) => {
    console.log(getTodaysDate())
  Day.find({})
    .then((day) => {
        res.send("Hello ROSS!");
    })
    .catch(next);
});


router.get("/:date", (req, res, next) => {
    Day.find({date: req.params.date})
    .then((day) => {
        res.send(day);
    })
    .catch(next);
});


router.post("/add", (req, res) => {
  let date = getTodaysDate();
  console.log(date)
  req.body.createdDate = `${date}`;
 // req.body.owner = req.user._id ? req.user._id : req.user.id;
  Day.create(req.body)
    .then(res.send("created"))
    .catch(console.error);
});

router.delete("/:dayId", (req, res, next) => {
 // let owner = req.user._id ? req.user._id : req.user.id;

  Invoice.findOneAndDelete({ _id: req.params.dayId}, () => {
   
    res.send("deleted");
  }).catch(console.error);
});
/*
router.put("/:invoiceId", (req, res) => {
  Invoice.findOneAndUpdate(
    {
      _id: req.params.invoiceId,
      owner: req.user._id ? req.user._id : req.user.id,
    },
    req.body,
    { new: true }
  )
    .then((invoice) => {
      generateLog(invoice.owner, req.body, "Invoice updated ");
      res.redirect(`/invoices/${req.params.invoiceId}`);
    })
    .catch(console.error);
});

router.put("/fromcustomer/:invoiceId", (req, res) => {
  Invoice.findOneAndUpdate(
    {
      _id: req.params.invoiceId,
      owner: req.user._id ? req.user._id : req.user.id,
    },
    req.body,
    { new: true }
  )
    .then((inv) => {
      generateLog(inv.owner, req.body, "Invoice updated ");

      Customer.find({
        name: inv.customer,
        owner: req.user._id ? req.user._id : req.user.id,
      }).then((customer) => {
        res.redirect(`/customers/${customer[0]._id}`);
      });
    })
    .catch(console.error);
});
*/

const dayController = router;
module.exports = dayController;