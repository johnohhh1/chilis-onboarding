"use strict";(()=>{var a={};a.id=385,a.ids=[385],a.modules={781:(a,e,t)=>{t.a(a,async(a,r)=>{try{t.r(e),t.d(e,{createRestaurant:()=>u,getAllRestaurants:()=>E,getOnboardingData:()=>o,getRestaurantStats:()=>m,initializeDatabase:()=>i,saveOnboardingData:()=>d});var n=t(3397),s=a([n]);async function i(){try{return await (0,n.sql)`
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
    `,console.log("Database initialized successfully"),!0}catch(a){return console.error("Error initializing database:",a),!1}}async function o(a=null){try{let e;e=a?(0,n.sql)`
        SELECT * FROM onboarding_data 
        WHERE restaurant_id = ${a}
        ORDER BY updated_at DESC 
        LIMIT 1
      `:(0,n.sql)`
        SELECT * FROM onboarding_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;let t=await e;if(t.rows.length>0)return{teamMembers:t.rows[0].team_members||[],lastSaved:t.rows[0].updated_at,version:"1.0",restaurantId:t.rows[0].restaurant_id};return{teamMembers:[],lastSaved:null,version:"1.0",restaurantId:a}}catch(e){return console.error("Error getting onboarding data:",e),{teamMembers:[],lastSaved:null,version:"1.0",restaurantId:a}}}async function d(a,e=null){try{let t=new Date().toISOString();return e?await (0,n.sql)`
        INSERT INTO onboarding_data (team_members, restaurant_id, updated_at)
        VALUES (${JSON.stringify(a)}::jsonb, ${e}, ${t})
        ON CONFLICT (restaurant_id) 
        DO UPDATE SET 
          team_members = EXCLUDED.team_members,
          updated_at = EXCLUDED.updated_at
      `:await (0,n.sql)`
        UPDATE onboarding_data 
        SET team_members = ${JSON.stringify(a)}::jsonb, updated_at = ${t}
        WHERE id = (SELECT id FROM onboarding_data ORDER BY updated_at DESC LIMIT 1)
      `,{success:!0,message:"Data saved successfully",timestamp:t}}catch(a){return console.error("Error saving onboarding data:",a),{success:!1,error:"Failed to save data"}}}async function E(){try{return(await (0,n.sql)`
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
    `).rows[0]}catch(a){throw console.error("Error creating restaurant:",a),a}}async function m(a){try{return(await (0,n.sql)`
      SELECT 
        COUNT(*) as total_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]') as active_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          (team_members->0->>'checklist')::jsonb ? 'all_completed') as completed_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          NOT (team_members->0->>'checklist')::jsonb ? 'all_completed') as pending_members
      FROM onboarding_data 
      WHERE restaurant_id = ${a}
    `).rows[0]}catch(a){return console.error("Error getting restaurant stats:",a),{total_members:0,active_members:0,completed_members:0,pending_members:0}}}n=(s.then?(await s)():s)[0],r()}catch(a){r(a)}})},3397:a=>{a.exports=import("@vercel/postgres")},3480:(a,e,t)=>{a.exports=t(5600)},4250:(a,e,t)=>{t.a(a,async(a,r)=>{try{t.r(e),t.d(e,{config:()=>u,default:()=>E,routeModule:()=>m});var n=t(3480),s=t(8667),i=t(6435),o=t(781),d=a([o]);o=(d.then?(await d)():d)[0];let E=(0,i.M)(o,"default"),u=(0,i.M)(o,"config"),m=new n.PagesAPIRouteModule({definition:{kind:s.A.PAGES_API,page:"/api/db",pathname:"/api/db",bundlePath:"",filename:""},userland:o});r()}catch(a){r(a)}})},5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6435:(a,e)=>{Object.defineProperty(e,"M",{enumerable:!0,get:function(){return function a(e,t){return t in e?e[t]:"then"in e&&"function"==typeof e.then?e.then(e=>a(e,t)):"function"==typeof e&&"default"===t?e:void 0}}})},8667:(a,e)=>{Object.defineProperty(e,"A",{enumerable:!0,get:function(){return t}});var t=function(a){return a.PAGES="PAGES",a.PAGES_API="PAGES_API",a.APP_PAGE="APP_PAGE",a.APP_ROUTE="APP_ROUTE",a.IMAGE="IMAGE",a}({})}};var e=require("../../webpack-api-runtime.js");e.C(a);var t=e(e.s=4250);module.exports=t})();