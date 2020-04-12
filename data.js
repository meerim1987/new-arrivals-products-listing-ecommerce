const getFutureTs = (days) => Math.floor((new Date().setDate(new Date().getDate() + days))/1000);

window.data = {
    categories: [
        {id: 'vg', label: 'Vegetable', qty: 30, image: 'cat1', icon: 'icon1'},
        {id: 'sf', label: 'Seafood', qty: 33, image: 'cat2', icon: 'icon3'},
        {id: 'wb', label: 'Wine & Beer', qty: 5, image: 'cat3', icon: 'icon4'},
        {id: 'of', label: 'Organic Fruits', qty: 27, image: 'cat4', icon: 'icon2'},
        {id: 'pi', label: 'Pie', qty: 11, image: 'cat5', icon: 'icon5'},
        {id: 'ct', label: 'Coctail', qty: 11, image: 'cat6', icon: 'icon6'}
    ],    
    products: [
        {id:'v1', label:'Cabbage', price: 90, catId: 'vg'},
        {id:'v2', label:'Cucumber', price: 30, catId: 'vg'},
        {id:'v3', label:'Potato', price: 10, catId: 'vg'},
        {id:'v4', label:'Mushrooms', price: 50, catId: 'vg'},
        {id:'v5', label:'Red Paprika', price: 250, catId: 'vg'},
        {id:'f1', label:'Mango', price: 111, catId: 'of'},
        {id:'f2', label:'Kiwi', price: 131, catId: 'of'},
        {id:'f3', label:'Grapes', price: 97, catId: 'of'},
        {id:'f4', label:'Cantaloupe', price: 76, catId: 'of'},
        {id:'f5', label:'Strawberry', price: 91, catId: 'of'},
        {id:'s1', label:'Rubyfish', price: 500, catId: 'sf'},
        {id:'s2', label:'Clams', price: 320, catId: 'sf'},
        {id:'s3', label:'Fish', price: 701, catId: 'sf'},
        {id:'s4', label:'Lobster', price: 901, catId: 'sf'},
        {id:'s5', label:'Crab', price: 421, catId: 'sf'},
        {id:'w1', label:'Beer', price: 97, catId: 'wb'},
        {id:'w2', label:'Champagne', price: 76, catId: 'wb'},
        {id:'w3', label:'Pink Lady', price: 120, catId: 'wb'},
        {id:'w4', label:'St Patrick Beer', price: 140, catId: 'wb'},
        {id:'w5', label:'Wine', price: 65, catId: 'wb'}
    ],
    deals:[
        {prodId:'f2', discount:10, expDate: getFutureTs(5), dealdescrip: 'Sweet and juicy kiwis. Naturally high in vitamin C. Why is it healthy? Vitamin C helps maintain healthy skin and bones.'},
        {prodId:'f3', discount:20, expDate: getFutureTs(3), dealdescrip: 'Is there anything that truly compares to them? I purchased a bunch at my local grocer and set them in the fridge, intending to snack on them at some point soon.'},
        {prodId:'w4', discount:15, expDate: getFutureTs(4), dealdescrip: 'For a completely natural beverage, beer offers serious low-calorie options. Moderate drinking is good for you, and beer is good for moderate drinking.'},
        {prodId:'s1', discount:11, expDate: getFutureTs(2), dealdescrip: 'Fish is a low-fat high quality protein. Fish is filled with omega-3 fatty acids and vitamins such as D and B2 (riboflavin).'},
        {prodId:'v5', discount:7, expDate: getFutureTs(6), dealdescrip: 'It is one of the most popular spices used across various cuisines due to its flavour and colour. It is made by grounding chilli peppers, bell peppers and other dried peppers coming from the Capsicum Annum family.'}
    ]
    
}
