"use strict";(()=>{var a={};a.id=896,a.ids=[896],a.modules={781:(a,t,e)=>{e.a(a,async(a,r)=>{try{e.r(t),e.d(t,{createRestaurant:()=>u,getAllRestaurants:()=>E,getOnboardingData:()=>i,getRestaurantStats:()=>l,initializeDatabase:()=>o,saveOnboardingData:()=>d});var n=e(3397),s=a([n]);async function o(){try{return await (0,n.sql)`
      CREATE TABLE IF NOT EXISTS onboarding_data (
        id SERIAL PRIMARY KEY,
        team_members JSONB NOT NULL DEFAULT '[]',
        restaurant_id INTEGER,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,await (0,n.sql)`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_updated_at 
      ON onboarding_data(updated_at);
    `,await (0,n.sql)`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        store_number VARCHAR(10) UNIQUE NOT NULL,
        address TEXT,
        manager_name VARCHAR(255),
        manager_email VARCHAR(255),
        phone VARCHAR(20),
        capacity INTEGER,
        opening_hours VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,await (0,n.sql)`
      ALTER TABLE onboarding_data 
      ADD COLUMN IF NOT EXISTS restaurant_id INTEGER;
    `,await (0,n.sql)`
      ALTER TABLE onboarding_data 
      ADD CONSTRAINT IF NOT EXISTS fk_restaurant 
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
    `,await (0,n.sql)`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_id 
      ON onboarding_data(restaurant_id);
    `,await (0,n.sql)`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_updated 
      ON onboarding_data(restaurant_id, updated_at);
    `,await (0,n.sql)`
      INSERT INTO restaurants (name, store_number, address, manager_name, manager_email) 
      VALUES ('Chili''s - Main Location', 'C00605', 'Main Location', 'Default Manager', 'manager@chilis.com')
      ON CONFLICT (store_number) DO NOTHING;
    `,await (0,n.sql)`
      INSERT INTO onboarding_data (team_members, restaurant_id, updated_at) 
      SELECT '[]'::jsonb, (SELECT id FROM restaurants WHERE store_number = 'C00605' LIMIT 1), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM onboarding_data);
    `,console.log("Database initialized successfully"),!0}catch(a){return console.error("Error initializing database:",a),!1}}async function i(a=null){try{let t;t=a?(0,n.sql)`
        SELECT * FROM onboarding_data 
        WHERE restaurant_id = ${a}
        ORDER BY updated_at DESC 
        LIMIT 1
      `:(0,n.sql)`
        SELECT * FROM onboarding_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;let e=await t;if(e.rows.length>0)return{teamMembers:e.rows[0].team_members||[],lastSaved:e.rows[0].updated_at,version:"1.0",restaurantId:e.rows[0].restaurant_id};return{teamMembers:[],lastSaved:null,version:"1.0",restaurantId:a}}catch(t){return console.error("Error getting onboarding data:",t),{teamMembers:[],lastSaved:null,version:"1.0",restaurantId:a}}}async function d(a,t=null){try{let e=new Date().toISOString();return t?await (0,n.sql)`
        INSERT INTO onboarding_data (team_members, restaurant_id, updated_at)
        VALUES (${JSON.stringify(a)}::jsonb, ${t}, ${e})
        ON CONFLICT (restaurant_id) 
        DO UPDATE SET 
          team_members = EXCLUDED.team_members,
          updated_at = EXCLUDED.updated_at
      `:await (0,n.sql)`
        UPDATE onboarding_data 
        SET team_members = ${JSON.stringify(a)}::jsonb, updated_at = ${e}
        WHERE id = (SELECT id FROM onboarding_data ORDER BY updated_at DESC LIMIT 1)
      `,{success:!0,message:"Data saved successfully",timestamp:e}}catch(a){return console.error("Error saving onboarding data:",a),{success:!1,error:"Failed to save data"}}}async function E(){try{return(await (0,n.sql)`
      SELECT * FROM restaurants 
      ORDER BY name ASC
    `).rows}catch(a){return console.error("Error getting restaurants:",a),[]}}async function u(a){try{return(await (0,n.sql)`
      INSERT INTO restaurants (
        name, store_number, address, manager_name, manager_email, 
        phone, capacity, opening_hours
      ) VALUES (
        ${a.name}, 
        ${a.store_number}, 
        ${a.address||null}, 
        ${a.manager_name||null}, 
        ${a.manager_email||null},
        ${a.phone||null},
        ${a.capacity||null},
        ${a.opening_hours||null}
      ) RETURNING *
    `).rows[0]}catch(a){throw console.error("Error creating restaurant:",a),a}}async function l(a){try{return(await (0,n.sql)`
      SELECT 
        COUNT(*) as total_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]') as active_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          (team_members->0->>'checklist')::jsonb ? 'all_completed') as completed_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          NOT (team_members->0->>'checklist')::jsonb ? 'all_completed') as pending_members
      FROM onboarding_data 
      WHERE restaurant_id = ${a}
    `).rows[0]}catch(a){return console.error("Error getting restaurant stats:",a),{total_members:0,active_members:0,completed_members:0,pending_members:0}}}n=(s.then?(await s)():s)[0],r()}catch(a){r(a)}})},994:(a,t,e)=>{e.a(a,async(a,r)=>{try{e.r(t),e.d(t,{config:()=>u,default:()=>E,routeModule:()=>l});var n=e(3480),s=e(8667),o=e(6435),i=e(3860),d=a([i]);i=(d.then?(await d)():d)[0];let E=(0,o.M)(i,"default"),u=(0,o.M)(i,"config"),l=new n.PagesAPIRouteModule({definition:{kind:s.A.PAGES_API,page:"/api/restaurant-stats",pathname:"/api/restaurant-stats",bundlePath:"",filename:""},userland:i});r()}catch(a){r(a)}})},3397:a=>{a.exports=import("@vercel/postgres")},3480:(a,t,e)=>{a.exports=e(5600)},3860:(a,t,e)=>{e.a(a,async(a,r)=>{try{e.r(t),e.d(t,{default:()=>o});var n=e(781),s=a([n]);async function o(a,t){if(t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","GET, OPTIONS"),t.setHeader("Access-Control-Allow-Headers","Content-Type"),"OPTIONS"===a.method)return void t.status(200).end();try{if(await (0,n.initializeDatabase)(),"GET"===a.method){let{restaurant_id:e}=a.query;if(e){let a=await (0,n.getRestaurantStats)(parseInt(e));t.status(200).json(a)}else{let a=await (0,n.getAllRestaurants)(),e=[];for(let t of a){let a=await (0,n.getRestaurantStats)(t.id);e.push({restaurant_id:t.id,restaurant_name:t.name,store_number:t.store_number,...a})}t.status(200).json(e)}}else t.status(405).json({error:"Method not allowed"})}catch(a){console.error("Restaurant stats API error:",a),t.status(500).json({error:"Internal server error"})}}n=(s.then?(await s)():s)[0],r()}catch(a){r(a)}})},5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6435:(a,t)=>{Object.defineProperty(t,"M",{enumerable:!0,get:function(){return function a(t,e){return e in t?t[e]:"then"in t&&"function"==typeof t.then?t.then(t=>a(t,e)):"function"==typeof t&&"default"===e?t:void 0}}})},8667:(a,t)=>{Object.defineProperty(t,"A",{enumerable:!0,get:function(){return e}});var e=function(a){return a.PAGES="PAGES",a.PAGES_API="PAGES_API",a.APP_PAGE="APP_PAGE",a.APP_ROUTE="APP_ROUTE",a.IMAGE="IMAGE",a}({})}};var t=require("../../webpack-api-runtime.js");t.C(a);var e=t(t.s=994);module.exports=e})();