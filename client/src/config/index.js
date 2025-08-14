export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "women", label: "Women" },
      { id: "sarees", label: "Sarees" },
      { id: "kurthies", label: "Kurthies" },
      { id: "dhoti", label: "Mens Dhoti"},
      { id: "offer", label: "OfferProducts" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
 {
    label: "Available Sizes (comma separated)",
    name: "sizes",
    componentType: "input",
    type: "text",
    placeholder: "e.g. S, M, L, XL",
  },
];

export const shoppingViewHeaderMenuItems = [
   {
    id: "home",
    label: "HOME",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "PRODUCTS",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "WOMEN",
    path: "/shop/listing",
  },
  {
    id: "kurthies",
    label: "KURTHIES",
    path: "/shop/listing",
  },
  {
    id: "sarees",
    label: "SAREES",
    path: "/shop/listing",
  },
   {
    id: "dhoti",
    label: "MENS DHOTI",
    path: "/shop/listing",
  },
  {
    id: "offer",
    label: "OFFER PRODUCTS",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "SEARCH",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  women: "Women",
  sarees: "Sarees",
  kurthies: "Kurthies",
  dhoti: "Mens Dhoti",
  offer: "Offer Products",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "women", label: "Women" },
    { id: "sarees", label: "Sarees" },
    { id: "kurthies", label: "Kurthies" },
    { id: "dhoti", label:"Mens Dhoti"},
    { id: "offer", label: "Offer Products" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
