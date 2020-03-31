const { toUpper, view, over, lensProp, compose } = require("ramda");

const L = {
  _0: lensProp(0),
  name: lensProp("name"),
  street: lensProp("street"),
  address: lensProp("address")
};

const user = { address: { street: { name: "Maple" } } };

// view the name prop
const addressStreeNameL = compose(L.address, L.street, L.name);
console.log(view(addressStreeNameL, user)); // Maple

// modify the name prop
console.log(over(addressStreeNameL, toUpper, user)); // { address: { street: { name: 'MAPLE' } } }

////////////////////////////////////
////
////
////////////////////////////////////

const users = [user];
const firstAddressStreeNameL = compose(L._0, L.address, L.street, L.name);
console.log(view(firstAddressStreeNameL, users)); // Maple
