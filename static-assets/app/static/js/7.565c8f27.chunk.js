(this["webpackJsonpecommerce-app"]=this["webpackJsonpecommerce-app"]||[]).push([[7],{607:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return T}));var c=a(0),n=a(48),s=a(23),i=a(25),r=a(17),l=a(1),o=a(554),u=a(347),j=a(555),d=a(556),h=a(55),p=a(175),m=a(176),b=a(97),f=a(98),g=a(130),v=a(129),O=(a(503),a(509)),x=(0,O.a.createSliderWithTooltip)(O.a.Range),_=function(e){Object(g.a)(a,e);var t=Object(v.a)(a);function a(){return Object(b.a)(this,a),t.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){var e=this.props,t=e.min,a=e.max,n=e.marks,s=e.value,i=e.tipFormatter,r=e.tipOptions,l=e.onChange,o=e.onAfterChange;return Object(c.jsxs)("div",{className:"slider",children:[Object(c.jsx)("div",{className:"slider__min",children:Object(c.jsx)("p",{children:i?i(t):t})}),Object(c.jsx)("div",{className:"slider__max",children:Object(c.jsx)("p",{children:i?i(a):a})}),Object(c.jsx)(x,{min:t,max:a,defaultValue:s,tipFormatter:i,marks:n,tipProps:r,onAfterChange:o,onChange:l})]})}}]),a}(l.PureComponent);_.defaultProps={marks:{},tipFormatter:function(e){return e},tipOptions:{visible:!0}};function k(e){var t=e.title,a=e.facets,n=e.checked,s=e.onSelection;return Object(c.jsxs)("nav",{className:"multiple-selection-facets",children:[t&&Object(c.jsx)("h2",{className:"facet-list-title",children:t}),Object(c.jsx)("div",{className:"form__form-group",children:a.map((function(e){return Object(c.jsx)("div",{className:"form__form-group-field",children:Object(c.jsx)(p.a,{name:"categories",label:e.label,value:e.value,checked:n.includes(e.value),onChange:function(t){return s(t.target.checked,e)}})},e.value)}))})]})}function N(e){var t=e.title,a=e.facets;return Object(c.jsxs)("nav",{className:"single-selection-facets",children:[t&&Object(c.jsx)("h2",{className:"facet-list-title",children:t}),Object(c.jsx)("div",{className:"form__form-group",children:a.map((function(e){return Object(c.jsx)("div",{className:"form__form-group-field",children:Object(m.b)({label:e.label,radioValue:e.value,input:{value:a[0].value,name:"singleGroupName",onChange:function(){}}})},e.value)}))})]})}function y(e){var t=e.min,a=e.max,n=e.value,s=e.title,i=e.onChange,r=e.tipFormatter;return Object(c.jsxs)("nav",{className:"range-selection-facet",children:[Object(c.jsx)("h2",{className:"facet-list-title",children:s}),Object(c.jsx)(_,{min:t,max:a,value:n,tipOptions:{visible:!1},onAfterChange:i,tipFormatter:r})]})}N.defaultProps=k.defaultProps=function e(t){var a=t.title,n=t.facets,s=t.checked,r=t.onSelection;return Object(c.jsxs)("nav",{className:"hierarchical-facets",children:[a&&Object(c.jsx)("h2",{className:"facet-list-title",children:"Clothing"}),n.map((function(a){return Object(c.jsxs)(l.Fragment,{children:[Object(c.jsx)("button",{className:"hierarchical-facets__item ".concat(s[a.value]?"hierarchical-facets__item--checked":""),onClick:function(){return r(a)},children:a.label}),a.children&&a.children.length&&s[a.value]&&Object(c.jsx)(e,Object(i.a)(Object(i.a)({},t),{},{title:null,facets:a.children}))]},a.value)}))]})}.defaultProps={title:"Clothing",facets:[{label:"Dresses",value:"dresses"},{label:"Cardigans & Sweaters",value:"cardigans_n_sweaters",children:[{label:"Sweaters",value:"sweaters"},{label:"Cardigans",value:"cardigans"},{label:"Sweatshirts",value:"sweatshirts"}]},{label:"Jumpsuits",value:"jumpsuits"},{label:"T-shirts",value:"t-shirts"},{label:"Jackets",value:"jackets"}],checked:{cardigans_n_sweaters:!0},onSelection:function(e){}};var C=a(5),w=a(160),q=a(69),P=a(51),S=a(70),F=a(32),E=a(201),L=a.n(E),R=a(506),A=a.n(R),J=a(507),D=a.n(J),I=a(508),V=a.n(I),K=a(36);function T(e){var t=Object(K.e)(),a=e.history,p=Object(K.f)((function(e){return e.products})),m=p.byId,b=p.facets,f=p.query,g=p.loading,v=p.errors,O=m?Object.values(m):null,x=Object(l.useRef)(),_=q.parse(e.location.search),E={list:[],types:{},state:{}};b&&b.forEach((function(e){var t=e.type,a=e.value;switch(E.list.push(a),E.types[a]=t,t){case"multiple":E.state[a]=[];break;case"single":E.state[a]="";break;case"range":E.state[a]=null}})),Object.entries(_).forEach((function(e){var t=Object(r.a)(e,2),a=t[0],c=t[1];"q"===a?(a="keywords",E.state[a]=c):E.state[a]="offset"===a||"limit"===a?c:["rating","price"].includes(a)?c.split("-").reduce((function(e,t,a){return Object(i.a)(Object(i.a)({},e),Object(s.a)({},0===a?"min":"max",parseInt(t)))}),{}):E.state[a]=c.split(",")}));var R=function(){t(Object(P.R)(E.state))};return Object(l.useEffect)(R,[a.location.search,f.locale,f.currency,t]),Object(l.useEffect)((function(){(x.current||{value:""}).value=f.keywords}),[f.keywords]),Object(c.jsx)(h.a,{children:Object(c.jsxs)(o.a,{children:[v[P.l]&&Object(c.jsx)(S.a,{color:"danger",className:"alert--bordered",icon:!0,dismiss:!1,children:Object(c.jsxs)("span",{children:["An error has occurred trying to fetch products.",Object(c.jsx)(u.a,{outline:!0,onClick:R,className:"btn-retry btn-sm",children:"Retry"})]})}),g[P.l]&&Object(c.jsx)(C.a,{contained:!0}),!1===g[P.l]&&Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)(j.a,{children:[E.state.keywords&&Object(c.jsxs)(d.a,{md:12,children:[Object(c.jsxs)("h2",{className:"page-title",children:['Search results for "',E.state.keywords,'"']}),Object(c.jsx)(F.b,{className:"page-subhead",to:"/catalog",children:"(clear query)"})]}),Object(c.jsx)(d.a,{md:9,children:Object(c.jsxs)("div",{className:"catalog-items__wrap",children:[Object(c.jsx)("div",{className:"catalog-page-controls",children:Object(c.jsx)(V.a,{containerClassName:"pagination",pageClassName:"pagination__item",pageLinkClassName:"pagination__link",previousClassName:"pagination__item",previousLinkClassName:"pagination__link pagination__link--arrow",nextClassName:"pagination__item",nextLinkClassName:"pagination__link pagination__link--arrow",pageRangeDisplayed:3,marginPagesDisplayed:3,activeClassName:"active",initialPage:f.offset/f.limit,pageCount:Math.ceil(f.total/f.limit),onPageChange:function(e){return function(e){var t=[],c=e-1,n=f.limit*c;null!=n&&t.push("offset=".concat(n)),_.q&&t.push("q=".concat(_.q)),_.price&&t.push("price=".concat(_.price)),_.rating&&t.push("rating=".concat(_.rating)),_.categories&&t.push("categories=".concat(_.categories)),_.colors&&t.push("colors=".concat(_.colors)),a.push("/catalog".concat(t.length?"?".concat(t.join("&")):""))}(e.selected+1)},disableInitialCallback:!0,previousLabel:Object(c.jsx)(D.a,{className:"pagination__link-icon"}),nextLabel:Object(c.jsx)(A.a,{className:"pagination__link-icon"})})}),Object(c.jsxs)("div",{className:"catalog-items",children:[O.map((function(e){return Object(c.jsx)(w.a,{product:e},e.id)})),0===O.length&&Object(c.jsx)(S.a,{color:"info",className:"alert--bordered",icon:!0,dismiss:!1,children:Object(c.jsxs)("span",{children:["No products to display (",Object(c.jsx)(F.b,{to:"/catalog",children:"clear filters"}),")"]})})]})]})}),Object(c.jsxs)(d.a,{md:3,children:[Object(c.jsx)("div",{className:"form",style:{background:"white",marginBottom:20,border:"1px solid #ddd"},children:Object(c.jsxs)("div",{className:"form__form-group-field",children:[Object(c.jsx)("div",{className:"form__form-group-icon",children:Object(c.jsx)(L.a,{})}),Object(c.jsx)("input",{ref:x,type:"text",name:"keywords",placeholder:"Keywords...",defaultValue:f.keywords,onKeyPress:function(e){return"Enter"===e.key&&function(e){var t=[];t.push("q=".concat(e||"")),_.price&&t.push("price=".concat(_.price)),_.rating&&t.push("rating=".concat(_.rating)),_.categories&&t.push("categories=".concat(_.categories)),_.colors&&t.push("colors=".concat(_.colors)),a.push("/catalog".concat(t.length?"?".concat(t.join("&")):""))}(e.target.value)}})]})}),b&&b.map((function(e){switch(e.type){case"single":case"multiple":var t="multiple"===e.type?k:N;return Object(c.jsx)(t,{title:e.name,checked:E.state[e.value],onSelection:function(t,c){return function(e,t,c){var s=c.value,i=f[e]||[];i=t?[].concat(Object(n.a)(i),[s]):i.filter((function(e){return e!==s}));var l=[];_.q&&l.push("q=".concat(_.q)),Object.entries(_).forEach((function(t){var a=Object(r.a)(t,2),c=a[0],n=a[1];"offset"===c?l.push("".concat(c,"=0")):c!==e&&l.push("".concat(c,"=").concat(n))})),i.length>0&&l.push("".concat(e,"=").concat(i.join(","))),a.push("/catalog".concat(l.length?"?".concat(l.join("&")):""))}(e.value,t,c)},facets:e.items.map((function(e){return{value:e.value,label:e.name}}))},e.value);case"range":return Object(c.jsx)(y,{onChange:function(t){return function(e,t){var c=[];_.q&&c.push("q=".concat(_.q)),Object.entries(_).forEach((function(t){var a=Object(r.a)(t,2),n=a[0],s=a[1];return n!==e&&c.push("".concat(n,"=").concat(s))})),c.push("".concat(e,"=").concat(t.join("-"))),a.push("/catalog".concat(c.length?"?".concat(c.join("&")):""))}(e.value,t)},title:e.name,min:e.min,max:e.max,tipFormatter:"price"===e.value?function(e){return"$".concat(e)}:function(e){return e},value:E.state[e.value]?[E.state[e.value].min,E.state[e.value].max]:[e.min,e.max]},e.value);default:return null}}))]})]})})]})})}}}]);
//# sourceMappingURL=7.565c8f27.chunk.js.map