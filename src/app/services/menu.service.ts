// services/menu.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private menuItems: MenuItem[] = [
    // 🥔 STARTERS / SNACKS
    { 
      id: 1, 
      name: 'Tornado Potato (Regular)', 
      category: 'Starters & Snacks', 
      price: 91,
      description: 'Spiral-cut potato on a stick, seasoned and deep-fried to crispy perfection',
      image: 'https://www.tastingtable.com/img/gallery/20-best-tips-and-tricks-for-the-ultimate-loaded-potatoes/put-a-twist-on-things-with-tornado-potatoes-1686686136.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Potato', 'Seasoning salt', 'Oil', 'Parsley']
    },
    { 
      id: 2, 
      name: 'Tornado Potato (Loaded)', 
      category: 'Starters & Snacks', 
      price: 129,
      description: 'Spiral potato topped with melted cheese, sour cream, and bacon bits',
      image: 'https://hips.hearstapps.com/hmg-prod/images/fully-loaded-tornado-potato-lead-662030d336ce9.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Potato', 'Cheese', 'Sour cream', 'Chives', 'Bacon bits']
    },
    { 
      id: 3, 
      name: 'Beoseot-Tangun (Fried Mushrooms)', 
      category: 'Starters & Snacks', 
      price: 389,
      description: 'Whole mushrooms coated in crispy batter and golden fried',
      image: 'https://i.pinimg.com/originals/2f/b8/bd/2fb8bd1533f920bd3c2093528e643d42.webp?w=500&auto=format&fit=crop',
      ingredients: ['Mushrooms', 'Flour batter', 'Garlic', 'Pepper', 'Oil']
    },
    { 
      id: 4, 
      name: 'Cheesy Corn Dog', 
      category: 'Starters & Snacks', 
      price: 129,
      description: 'Hot dog stuffed with cheese, battered and fried crispy',
      image: 'https://i.ytimg.com/vi/imi8YDvyWn0/maxresdefault.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Hot dog', 'Corn batter', 'Mozzarella cheese', 'Mustard', 'Ketchup']
    },
    { 
      id: 5, 
      name: 'Sausage Corn Dog', 
      category: 'Starters & Snacks', 
      price: 259,
      description: 'Juicy sausage battered in cornmeal coating and deep-fried to golden perfection',
      image: 'https://tse3.mm.bing.net/th/id/OIP.7BSoHetcTo8BVjPQtVg9uQHaGE?w=1280&h=1049&rs=1&pid=ImgDetMain&o=7&rm=3?w=500&auto=format&fit=crop',
      ingredients: ['Pork sausage', 'Cornmeal batter', 'Oil', 'Mustard', 'Ketchup']
    },

    // 🌶️ KOREAN LAPHING
    { 
      id: 6, 
      name: 'Kimchi Laphing', 
      category: 'Korean Laphing', 
      price: 129,
      description: 'Cold mung bean noodles tossed with spicy kimchi and Korean flavors',
      koreanName: '김치 래핑',
      image: 'https://www.koreanbapsang.com/wp-content/uploads/2019/11/DSC6782-4-1.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Kimchi', 'Soy sauce', 'Garlic', 'Sesame oil']
    },
    { 
      id: 7, 
      name: 'Paneer Laphing', 
      category: 'Korean Laphing', 
      price: 145,
      description: 'Cold noodles with grilled paneer cubes and Indian spices',
      koreanName: '파니르 래핑',
      image: 'https://i.pinimg.com/736x/6e/05/b1/6e05b19d89fd939cdc862186c728f6bf.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Paneer', 'Spices', 'Coriander', 'Lemon']
    },
    { 
      id: 8, 
      name: 'Maya Special Laphing', 
      category: 'Korean Laphing', 
      price: 235,
      description: 'Signature cold noodles with special Maya sauce, fresh vegetables and sesame seeds',
      koreanName: '마야 스페셜 래핑',
      image: 'https://i.pinimg.com/736x/40/c4/2a/40c42ac0547cb444e1b8e793ce07e08e.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Special Maya sauce', 'Fresh veggies', 'Sesame seeds', 'Spring onions']
    },
    { 
      id: 9, 
      name: 'Chicken Laphing', 
      category: 'Korean Laphing', 
      price: 155,
      description: 'Spicy cold noodles with tender shredded chicken and Korean seasonings',
      image: 'https://images.slurrp.com/prod/articles/ed3o174mugc.webp?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Chicken', 'Gochujang', 'Sesame oil', 'Spring onions']
    },
    { 
      id: 10, 
      name: 'Shrimp Laphing', 
      category: 'Korean Laphing', 
      price: 195,
      description: 'Cold noodles with fresh shrimp, Korean spices and a hint of citrus',
      image: 'https://curlytales.com/wp-content/uploads/2019/10/myRepublica.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Shrimp', 'Korean chili paste', 'Lemon juice', 'Garlic']
    },
    { 
      id: 11, 
      name: 'Fish Laphing', 
      category: 'Korean Laphing', 
      price: 195,
      description: 'Cold noodles with fish flakes, sesame oil and traditional Korean seasonings',
      image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Fish flakes', 'Sesame oil', 'Soy sauce', 'Seaweed']
    },
    { 
      id: 12, 
      name: 'Mutton Laphing', 
      category: 'Korean Laphing', 
      price: 169,
      description: 'Cold noodles with tender mutton pieces, traditional spices and herbs',
      image: 'https://images.slurrp.com/prod/articles/bra4c6af60j.webp?w=500&auto=format&fit=crop',
      ingredients: ['Mung bean starch noodles', 'Mutton', 'Spices', 'Herbs', 'Garlic paste']
    },

    // 🥞 RICE / PANCAKES
    { 
      id: 13, 
      name: 'Haemul Pajeon (Pancakes)', 
      category: 'Rice / Pancakes', 
      price: 259,
      description: 'Savory Korean seafood pancake with crispy edges and tender center',
      koreanName: '해물 파전',
      image: 'https://eggcellent.recipes/wp-content/uploads/2024/04/Korean-Pancake-Pajeon-Recipe-768x768.png?w=500&auto=format&fit=crop',
      ingredients: ['Seafood mix', 'Green onions', 'Flour batter', 'Egg', 'Soy dipping sauce'],
       addons: [
    {name: 'Chicken', price: 30 },
    {name: 'Fish', price: 50},
    {name: 'Prawn', price: 70}
  ]
    },
    // { 
    //   id: 14, 
    //   name: 'Rice with Chicken / Fish / Prawn', 
    //   category: 'Rice / Pancakes', 
    //   halfPrice: 159, 
    //   fullPrice: 199,
    //   description: 'Steamed rice served with your choice of protein and Korean side dishes',
    //   image: 'https://uploads-ssl.webflow.com/60da4419d98adf0a36dc660e/63345f664f88b3cff7013c9c_KoreanChickenBowls-16.jpg?w=500&auto=format&fit=crop',
    //   ingredients: ['Steamed rice', 'Choice of protein', 'Kimchi', 'Seasoned vegetables', 'Sesame oil']
    // },

    // 🍣 SUSHI
    {
  id: 14,
  name: 'Kimbap Veg',
  category: 'Kimbap (Korean Sushi)',
  halfPrice: 299,
  fullPrice: 519,
  description: 'Fresh vegetable kimbap rolls',
  image: 'https://thumbs.dreamstime.com/b/vegan-sushi-rolls-avocado-cucumber-created-generative-ai-286777418.jpg?w=500',
  addons: [
    {
      name: 'Chicken', halfPrice: 20, fullPrice: 50,
      price: 0
    },
    {
      name: 'Fish', halfPrice: 40, fullPrice: 75,
      price: 0
    },
    {
      name: 'Prawn', halfPrice: 70, fullPrice: 100,
      price: 0
    }
  ]
},
{
  id: 15,
  name: 'Tempura Kimbap Veg',
  category: 'Kimbap (Korean Sushi)',
  halfPrice: 365,
  fullPrice: 585,
  description: 'Crispy tempura kimbap with vegetables',
  image: 'https://ichisushi.com/wp-content/uploads/2022/05/Best-Chicken-Sushi-Recipes-1024x680.jpg?w=500',
  addons: [
    {
      name: 'Chicken', halfPrice: 20, fullPrice: 50,
      price: 0
    },
    {
      name: 'Fish', halfPrice: 40, fullPrice: 75,
      price: 0
    },
    {
      name: 'Prawn', halfPrice: 70, fullPrice: 100,
      price: 0
    }
  ]
},  
    // { 
    //   id: 17, 
    //   name: 'Sushi Fish', 
    //   category: 'Sushi', 
    //   halfPrice: 249, 
    //   fullPrice: 475,
    //   description: 'Fresh fish sushi rolls with cucumber, avocado and premium rice (4/8 pcs)',
    //   image: 'https://lentillovingfamily.com/wp-content/uploads/2024/08/16-types-of-sushi-unagi-nigiri-768x432.jpg?w=500&auto=format&fit=crop',
    //   ingredients: ['Sushi rice', 'Nori', 'Fresh fish', 'Cucumber', 'Avocado', 'Wasabi']
    // },
    // { 
    //   id: 18, 
    //   name: 'Sushi Prawn', 
    //   category: 'Sushi', 
    //   halfPrice: 299, 
    //   fullPrice: 499,
    //   description: 'Juicy prawn sushi rolls wrapped in nori with fresh vegetables (4/8 pcs)',
    //   image: 'https://tse1.mm.bing.net/th/id/OIP.9ERqEODH4pDatEoCyzWgiQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3?w=500&auto=format&fit=crop',
    //   ingredients: ['Sushi rice', 'Nori', 'Prawns', 'Cucumber', 'Mayonnaise', 'Sesame']
    // },

    // 🍜 THUKPA
    { 
      id: 16, 
      name: 'Thukpa Veg', 
      category: 'Thukpa', 
      price: 195,
      description: 'Warm Tibetan noodle soup loaded with mixed vegetables',
      image: 'https://www.funfoodfrolic.com/wp-content/uploads/2024/07/thukpa-Blog-1024x1024.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Noodles', 'Mixed vegetables', 'Garlic', 'Ginger', 'Spring onions']
    },
    { 
      id: 17, 
      name: 'Thukpa Chicken', 
      category: 'Thukpa', 
      price: 259,
      description: 'Hearty Tibetan noodle soup with tender chicken pieces and vegetables',
      image: 'https://tse4.mm.bing.net/th/id/OIP.b3pIAJn_Z9hzuhQepMqr7QHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3?w=500&auto=format&fit=crop',
      ingredients: ['Noodles', 'Chicken', 'Mixed vegetables', 'Garlic', 'Ginger', 'Herbs']
    },
    { 
      id: 18, 
      name: 'Thukpa Prawns', 
      category: 'Thukpa', 
      price: 425,
      description: 'Rich Tibetan noodle soup with succulent prawns and fresh vegetables',
      image: 'https://holidays.tripfactory.com/blogs/wp-content/uploads/sites/6/2024/03/Thukpa.webp?w=500&auto=format&fit=crop',
      ingredients: ['Noodles', 'Prawns', 'Mixed vegetables', 'Garlic', 'Ginger', 'Spring onions']
    },

    // 🍲 JJIGAE
    { 
      id: 19, 
      name: 'Kimchi Jjigae Veg', 
      category: 'Jjigae', 
      price: 259,
      description: 'Spicy Korean kimchi stew with tofu and vegetables',
      koreanName: '김치 찌개',
      image: 'https://www.nasoya.com/wp-content/uploads/2022/10/vegan-kimchi-stew_feat.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Kimchi', 'Tofu', 'Onion', 'Garlic', 'Gochujang', 'Sesame oil']
    },
    { 
      id: 20, 
      name: 'Kimchi Jjigae Chicken / Fish / Prawn', 
      category: 'Jjigae', 
      price: 325,
      description: 'Spicy kimchi stew with your choice of protein, served boiling hot',
      koreanName: '김치 찌개',
      image: 'https://i.cdn.newsbytesapp.com/images/l16120240627164201.jpeg?w=500&auto=format&fit=crop',
      ingredients: ['Kimchi', 'Choice of protein', 'Tofu', 'Gochujang', 'Garlic', 'Spring onions']
    },
    { 
      id: 21, 
      name: 'Doenjang Jjigae Chicken / Fish / Prawn', 
      category: 'Jjigae', 
      price: 455,
      description: 'Hearty fermented soybean stew with vegetables and choice of protein',
      koreanName: '된장 찌개',
      image: 'https://thumbs.dreamstime.com/b/kimchi-jjigae-comforting-stew-made-kimchi-tofu-pork-various-vegetables-flavored-gochugaru-gochujang-kimchi-300056701.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Doenjang', 'Choice of protein', 'Tofu', 'Potato', 'Zucchini', 'Gochugaru']
    },

    // 🍛 MAIN COURSE
    { 
      id: 22, 
      name: 'Bibimbap Veg', 
      category: 'Bibimbap', 
      price: 345,
      description: 'Korean mixed rice bowl with assorted vegetables and gochujang sauce',
      koreanName: '비빔밥',
      image: 'https://thefoodietakesflight.com/wp-content/uploads/2020/08/e345f8_15e89361e13a461c8c8707e272ca6399mv256456.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Rice', 'Carrot', 'Spinach', 'Bean sprouts', 'Gochujang', 'Egg']
    },
    { 
      id: 23, 
      name: 'Bibimbap Non-Veg', 
      category: 'Bibimbap', 
      price: 649,
      description: 'Korean mixed rice bowl with marinated meat, vegetables and fried egg',
      koreanName: '비빔밥',
      image: 'https://www.seasonsandsuppers.ca/wp-content/uploads/2016/12/chicken-bibimbap-3.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Rice', 'Marinated meat', 'Assorted vegetables', 'Fried egg', 'Gochujang', 'Sesame oil']
    },
    { 
      id: 24, 
      name: 'Maya Special Rice Bowl with Laphing (Veg)', 
      category: 'Maya Special', 
      price: 649,
      description: 'Signature rice bowl topped with laphing noodles, vegetables and special sauce',
      image: 'https://product-assets.faasos.io/production/product/image_1671192301086_Kadhai_paneer_rice_bowl.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Rice', 'Laphing noodles', 'Mixed vegetables', 'Special sauce', 'Sesame seeds', 'Spring onions']
    },
    { 
      id: 25, 
      name: 'Maya Special Noodle Bowl with Laphing (Non-Veg)', 
      category: 'Maya Special', 
      price: 910,
      description: 'Premium noodle bowl with laphing noodles, choice of meat and signature toppings',
      image: 'https://images.getrecipekit.com/20220322222559-sriracharamen.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Noodles', 'Laphing noodles', 'Choice of meat', 'Vegetables', 'Special sauce', 'Egg']
    },
    { 
      id: 26, 
      name: 'dak doritang', 
      category: 'Maya Special', 
      halfPrice: 455,
      fullPrice: 649,
      description: 'Braised spicy chicken, is a traditional Korean dish made by boiling chunks of chicken with vegetables and spices.',
      image: 'https://preview.redd.it/tteokbokki-korean-spicy-rice-cake-v0-894c6uqysna81.jpg?width=640&crop=smart&auto=webp&s=ec4329897ffd1375c4b590dfa4808e9a0b68c707?w=500&auto=format&fit=crop',
      ingredients: ['Chicken', 'Vegetables', 'Spices', 'Soya Sauce', 'Seasoning Paste']
    },
    { 
      id: 27, 
      name: 'Tongdak Gul', 
      category: 'Maya Special', 
      halfPrice: 455,
      fullPrice: 649,
      description: 'Tongdak is a popular Korean dish made from deep-fried whole chicken, seasoned with salt and black pepper, and coated with a thin layer of weak flour.',
      image: 'https://www.maangchi.com/wp-content/uploads/2019/01/koreanfriedchicken.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Whole chicken', 'Weak flour', 'Spices', 'Weak flour', 'Seasoning Paste']
    },
    { 
      id: 28, 
      name: 'Saangseon Jun', 
      category: 'Maya Special', 
      halfPrice: 649,
      fullPrice: 910,
      description: 'Saangseon Jun, or Korean pan-fried fish, is a simple yet delicious dish that can be prepared with a variety of white-fleshed fish.',
      image: 'https://fatqueencooks.com/wp-content/uploads/hk-fish.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Fish fillets', 'flour', 'Egg', 'Salt and Pepper', 'Soya Sauce' , 'Gochugaru']
    },
     { 
      id: 29, 
      name: 'Boe-soet Bok-keum', 
      category: 'Maya Special', 
      price: 455,
      description: 'Boe-soet Bok-keum also known as Stir-Fried Mushrooms, is a traditional Korean dish that showcases the natural umami flavors of mushrooms.',
      image: 'https://img.freepik.com/premium-photo/beoseotbokkeum-stirfried-mushrooms-with-various-seasonings-vegetables-korean-side-dish_921026-34788.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Mushrooms', 'Garlic', 'Soy Sauce', 'Sesame Oil', 'Green Onions']
    },
    { 
      id: 30, 
      name: 'Dak Galbi', 
      category: 'Dak Galbi', 
      halfPrice: 349, 
      fullPrice: 399,
      description: 'Spicy Korean stir-fried chicken with cabbage, sweet potato and rice cakes',
      koreanName: '닭갈비',
      image: 'https://media3.bosch-home.com/Images/600x/16368465_Dak_Galbi_-_Final_Dish_-_Mast_Head.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Chicken', 'Cabbage', 'Sweet potato', 'Rice cakes', 'Gochujang', 'Sesame oil']
    },
    // 🍛 CURRIES & NOODLES
    { 
      id: 31, 
      name: 'Red Thai Curry Veg', 
      category: 'Curries & Noodles', 
      price: 325,
      description: 'Creamy coconut red Thai curry with vegetables and bamboo shoots',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop',
      ingredients: ['Coconut milk', 'Red curry paste', 'Bamboo shoots', 'Bell peppers', 'Thai basil']
    },
    { 
      id: 32, 
      name: 'Green Thai Curry Veg', 
      category: 'Curries & Noodles', 
      price: 325,
      description: 'Aromatic green Thai curry with fresh vegetables and Thai herbs',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop',
      ingredients: ['Coconut milk', 'Green curry paste', 'Eggplant', 'Basil', 'Kaffir lime leaves']
    },
    { 
      id: 33, 
      name: 'Red Thai Curry Non-Veg', 
      category: 'Curries & Noodles', 
      price: 389,
      description: 'Spicy red Thai curry with tender chicken or meat in coconut milk',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop',
      ingredients: ['Coconut milk', 'Red curry paste', 'Chicken/Meat', 'Bell peppers', 'Thai basil']
    },
    { 
      id: 34, 
      name: 'Green Thai Curry Non-Veg', 
      category: 'Curries & Noodles', 
      price: 389,
      description: 'Fragrant green Thai curry with chicken or meat and fresh herbs',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop',
      ingredients: ['Coconut milk', 'Green curry paste', 'Chicken/Meat', 'Eggplant', 'Thai basil']
    },
    { 
      id: 35, 
      name: 'Green Thai Curry Seafood', 
      category: 'Curries & Noodles', 
      price: 519,
      description: 'Green Thai curry with prawns, fish and mixed seafood in coconut sauce',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop',
      ingredients: ['Coconut milk', 'Green curry paste', 'Mixed seafood', 'Bell peppers', 'Kaffir lime']
    },

    // // 🍗 DAK GALBI
    // { 
    //   id: 34, 
    //   name: 'Dak Galbi Veg', 
    //   category: 'Dak Galbi', 
    //   halfPrice: 249, 
    //   fullPrice: 299,
    //   description: 'Spicy stir-fried tofu and cabbage with sweet potato and gochujang',
    //   koreanName: '닭갈비',
    //   image: 'https://zestyplan.com/wp-content/uploads/2024/06/DALL%C2%B7E-2024-06-16-07.46.29-A-mouth-watering-Dak-Galbi-dish-served-on-a-traditional-Korean-hot-plate.-The-dish-includes-marinated-chicken-cabbage-sweet-potatoes-and-rice-cakes.webp?w=500&auto=format&fit=crop',
    //   ingredients: ['Tofu/Soy protein', 'Cabbage', 'Sweet potato', 'Gochujang', 'Garlic', 'Sesame leaves']
    // },
    

    // 🍜 KOREAN RAMEN
    { 
      id: 36, 
      name: 'Korean Ramen Veg', 
      category: 'Korean Ramen', 
      price: 199,
      description: 'Spicy Korean ramen noodles in rich vegetable broth with toppings',
      image: 'https://tse2.mm.bing.net/th/id/OIP.UuvQlo-KT8E2-tnIcNZP0AHaJ_?w=500&auto=format&fit=crop',
      ingredients: ['Ramen noodles', 'Vegetable broth', 'Mushrooms', 'Spring onions', 'Egg', 'Seaweed']
    },
    { 
      id: 37, 
      name: 'Korean Ramen Non-Veg', 
      category: 'Korean Ramen', 
      price: 259,
      description: 'Spicy Korean ramen with chicken or meat in savory broth',
      image: 'https://hips.hearstapps.com/thepioneerwoman/wp-content/uploads/2017/09/elevating-instant-ramen-15.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Ramen noodles', 'Chicken/Meat broth', 'Chicken/Meat', 'Egg', 'Spring onions', 'Seaweed']
    },
    { 
      id: 38, 
      name: 'Korean Ramen Prawns', 
      category: 'Korean Ramen', 
      price: 365,
      description: 'Korean ramen loaded with prawns in spicy seafood broth',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&auto=format&fit=crop',
      ingredients: ['Ramen noodles', 'Seafood broth', 'Prawns', 'Mussels', 'Spring onions', 'Seaweed']
    },
    { 
      id: 39, 
      name: 'Korean Ramen Fish', 
      category: 'Korean Ramen', 
      price: 299,
      description: 'Korean ramen with fish cakes and vegetables in light fish broth',
      image: 'https://as2.ftcdn.net/v2/jpg/02/52/85/21/1000_F_252852130_9U4sSnANtLUEkFcCP8ztSr73HnoDAK89.jpg?w=500&auto=format&fit=crop',
      ingredients: ['Ramen noodles', 'Fish broth', 'Fish cakes', 'Vegetables', 'Egg', 'Spring onions']
    },

    // 🥤 BEVERAGES
    { 
      id: 40, 
      name: 'Black Tea', 
      category: 'Beverages', 
      price: 65,
      description: 'Hot Indian black tea brewed fresh',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop',
      ingredients: ['Black tea leaves', 'Water', 'Sugar optional', 'Milk optional']
    },
    { 
      id: 41, 
      name: 'Black Coffee', 
      category: 'Beverages', 
      price: 105,
      description: 'Freshly brewed strong black coffee',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop',
      ingredients: ['Coffee beans', 'Hot water', 'Sugar optional']
    },
    { 
      id: 42, 
      name: 'Coconut Water', 
      category: 'Beverages', 
      price: 130,
      description: 'Fresh tender coconut water served chilled',
      image: 'https://nico.co.id/wp-content/uploads/2022/08/Coconut-Water-Article.jpg',
      ingredients: ['Fresh coconut water', 'Ice cubes']
    },
    { 
      id: 43, 
      name: 'Electrolyte Water', 
      category: 'Beverages', 
      price: 40,
      description: 'Hydrating electrolyte-infused water for instant refreshment',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop',
      ingredients: ['Purified water', 'Electrolytes', 'Minerals']
    },
    { 
      id: 44, 
      name: 'Multi Vitamin Water', 
      category: 'Beverages', 
      price: 40,
      description: 'Vitamin-enriched flavored water with essential nutrients',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop',
      ingredients: ['Purified water', 'Vitamin blend', 'Natural flavors']
    },
    { 
      id: 45, 
      name: 'Protein Water', 
      category: 'Beverages', 
      price: 150,
      description: 'Protein-fortified energy water for active lifestyle',
      image: 'https://aquatein.com/cdn/shop/files/RendersPPT_05_2024.jpg?v=1737080391?w=500&auto=format&fit=crop',
      ingredients: ['Purified water', 'Whey protein', 'Electrolytes', 'Vitamins']
    },
    { 
      id: 46, 
      name: 'Mineral Water', 
      category: 'Beverages', 
      price: 20,
      description: 'Bottled natural mineral water, 500ml',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop',
      ingredients: ['Natural mineral water']
    }
  ];

  getMenuItems(): Observable<MenuItem[]> {
    return of(this.menuItems);
  }
}