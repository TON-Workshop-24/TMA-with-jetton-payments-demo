import{j as s,r as i,b as p,u as m,a as u,R as x}from"./index-17611954.js";import{B as r,c as h,u as f}from"./useMainButton-b4f7025d.js";import{P as b}from"./index-687d247d.js";import{u as g}from"./useBackButton-22433ffc.js";const k={tab:(a,e)=>()=>h("display:flex;align-items:center;justify-content:center;background:",a?"#0098EA":"transparent",";width:calc(100% / ",e," - ",(e-1)*4,"px);height:32px;border-radius:8px;font-weight:600;color:",a?"#ffffff":"#333333",";","")},y=({activeTab:a,tabs:e})=>s(r,{display:"flex",flexWrap:"nowrap",gap:"4px",p:"8px",radius:"8px",background:"#f2f2f2",width:"100%",children:e.map(n=>s("div",{css:k.tab(a===n.id,e.length),children:n.name},n.id))}),l={radioButton:{name:"1rvubq1",styles:"-webkit-appearance:none;-moz-appearance:none;appearance:none;min-width:20px;min-height:20px;border:1px solid #999;border-radius:50%;outline:none;margin:0;position:relative;&:checked{background-color:#0098EA;border-color:#0098EA;}"},label:{name:"11g4mt0",styles:"font-size:16px"}},v=({name:a,onChange:e,options:n})=>{const[d,o]=i.useState(n[0]),c=i.useCallback(t=>()=>{o(t),e&&e(t)},[e]);return s(r,{display:"flex",flexDirection:"column",gap:"8px",children:n.map(t=>p(r,{display:"flex",alignItems:"center",gap:"8px",onClick:c(t),children:[s("input",{defaultChecked:t.id===d.id,type:"radio",name:a,id:t.id,css:l.radioButton}),s("label",{css:l.label,htmlFor:t.id,children:t.name})]},t.id))})},w={header:{name:"1a6rgvc",styles:"font-size:18px;font-weight:600;text-align:center;margin-bottom:16px"}},O=()=>{const a=m(),{cart:e,addProduct:n,removeProduct:d}=u(),o=i.useCallback(()=>{a(x.ORDER_HISTORY)},[a]);return g(),f({text:"Connect Ton Wallet",onClick:o}),i.useEffect(()=>{Object.keys(e).length===0&&a(-1)},[e,a]),p(r,{width:"100%",px:"16px",pt:"16px",children:[s("header",{css:w.header,children:"Order ID: 123456789"}),s(r,{display:"flex",flexDirection:"column",width:"100%",gap:"8px",children:Object.values(e).map((c,t)=>s(b,{product:c,size:"dense",onAdd:n,onRemove:d},t))}),s(r,{mt:"24px",mb:"16px",width:"100%",children:s(y,{activeTab:"1",tabs:[{id:"1",name:"Pickup"},{id:"2",name:"Delivery"}]})}),s(v,{name:"address",options:[{id:"address1",name:"Praça Marquês de Pombal 12 A, 1250-162 Lisboa"},{id:"address2",name:"Momma Reenstiernas Palats, Wollmar Yxkullsgatan 23, 118 50 Stockholm"}]})]})};export{O as Checkout};