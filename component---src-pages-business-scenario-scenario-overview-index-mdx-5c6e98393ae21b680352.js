(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{AHeu:function(e,a,t){"use strict";t.r(a),t.d(a,"_frontmatter",(function(){return c})),t.d(a,"default",(function(){return b}));t("91GP"),t("rGqo"),t("yt8O"),t("Btvt"),t("RW0V"),t("q1tI");var r=t("7ljp"),n=t("013z");t("qKvR");function i(){return(i=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var t=arguments[a];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var o,c={},s=(o="InlineNotification",function(e){return console.warn("Component "+o+" was not imported, exported, or provided by MDXProvider as global scope"),Object(r.b)("div",e)}),p={_frontmatter:c},l=n.a;function b(e){var a=e.components,t=function(e,a){if(null==e)return{};var t,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,["components"]);return Object(r.b)(l,i({},p,t,{components:a,mdxType:"MDXLayout"}),Object(r.b)(s,{kind:"warning",mdxType:"InlineNotification"},Object(r.b)("strong",null,"TODO")," - UNDER CONSTRUCTION"),Object(r.b)("p",null,"As part of producing IBM best practice and reference architectures for event driven, we have brought together a complete scenario which covers all aspects of developing an event driven solution. The shipping business provides a good foundation for many of these concepts and enables us to show how to develop event driven solutions using some of the common architecture patterns."),Object(r.b)("h2",null,"Business process statement"),Object(r.b)("p",null,"This reference scenario is based on a shipping supply chain from manufacturer to retailer. There are three main actors; the retailer, the manufacturer and the shipping company."),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},"A retailer orders goods from an overseas manufacturer."),Object(r.b)("li",{parentName:"ol"},"The manufacturer needs to ship goods from their warehouse to the retailer. To do this they use a shipping company."),Object(r.b)("li",{parentName:"ol"},"The manufacturer interacts with the shipping company through the shipping companies UI, where they are able to place and keep track of order."),Object(r.b)("li",{parentName:"ol"},"The shipping company operates a fleet of ships, loaded with ‘reefer’ containers. It allocates orders to containers and voyages depending on the load and shipping route needed."),Object(r.b)("li",{parentName:"ol"},"While at sea the containers are monitored for health using their in-built sensors."),Object(r.b)("li",{parentName:"ol"},"The manufacturer is kept informed on the status of their order during the lifecycle of the process.")),Object(r.b)("span",{className:"gatsby-resp-image-wrapper",style:{position:"relative",display:"block",marginLeft:"auto",marginRight:"auto",maxWidth:"1152px"}},"\n      ",Object(r.b)("span",i({parentName:"span"},{className:"gatsby-resp-image-background-image",style:{paddingBottom:"12.847222222222221%",position:"relative",bottom:"0",left:"0",backgroundImage:"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAADCAYAAACTWi8uAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAnklEQVQI1yXOSQ6FIBAEUO9/Ki/AAiVhh3GIiYpCnMfUT/VfdaXpfnRynieyLENZlriuC2maIsaIZVmglMK2bZjnGVpr6XGes8MwSB7HEV3XSe77HgkR55wgx3GgKAqEELCuK/I8l7rvO4wxsvB9H6y1gjKzV9c17vtG27Z/kPrzPHIB8WmaBGflG0EC/Oh9X1RVhaZpJHOHxxD03uMHkU/h6xXOQBYAAAAASUVORK5CYII=')",backgroundSize:"cover",display:"block"}})),"\n  ",Object(r.b)("img",i({parentName:"span"},{className:"gatsby-resp-image-image",alt:"Scenario",title:"Scenario",src:"/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/3cbba/shipping-scenario-overview.png",srcSet:["/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/7fc1e/shipping-scenario-overview.png 288w","/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/a5df1/shipping-scenario-overview.png 576w","/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/3cbba/shipping-scenario-overview.png 1152w","/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/0b124/shipping-scenario-overview.png 1728w","/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/4ea69/shipping-scenario-overview.png 2304w","/refarch-kc/static/f60b44c6f2889cabba96d038fe52bcf7/d1a3c/shipping-scenario-overview.png 2684w"],sizes:"(max-width: 1152px) 100vw, 1152px",style:{width:"100%",height:"100%",margin:"0",verticalAlign:"middle",position:"absolute",top:"0",left:"0"},loading:"lazy"})),"\n    "),Object(r.b)("p",null,"We are using goods to be transported in refrigerator containers or reefer containers to keep the ‘cold chain’ of transported products."),Object(r.b)("span",{className:"gatsby-resp-image-wrapper",style:{position:"relative",display:"block",marginLeft:"auto",marginRight:"auto",maxWidth:"788px"}},"\n      ",Object(r.b)("span",i({parentName:"span"},{className:"gatsby-resp-image-background-image",style:{paddingBottom:"65.625%",position:"relative",bottom:"0",left:"0",backgroundImage:"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAACXBIWXMAABYlAAAWJQFJUiTwAAAClElEQVQ4y32T3UvTURjHf39ELzddRd5EF7WLCgIhEMLqIuhiNxJiXSRUshIttbKR+bJZqGmikkQ3QVfqRSUijFJWuHQvbr/3l/3atM3NnMYQc9+e39lG09ADD+ccznk+53ueFw77jFwO2N7extbWFrLZLNbXM1hdTUPXdXhmZhEWBKxlMjt8uBx5lTpl6EI6nUYi8RPxeAzRqAFNU8ELPILBAESRZ/uXQ6NobH2Gzt5XGHn7DhMfJ8FLErgUOUuyBJlMkkWaRUiSwGZFkaGqClM05/PBHwjRAzEYhoGB4VE4mh6ipc2NhtYO3G1x4v3YOLhEIoFQKLgLIpMKhSnRNY2AGjQ9iu9zHoTmPyFqxtA/NIJ7BHzc7iLrxgNnOz5MTYNLJpMIhxcJKBaAEgPmoSpZHmip4iN+iLyP9gYGX7/Bk47ncHZ242nXC7R2uDHl+WwBV/YBKgWgnldKUMOIsnXf4DDq6m+jts4Be9U1UtuML96v4FZWikBhD6DKFLJvM8UKW7t6+nCj9ibOlZfjQmUlHPeb8c03T0lJpRCJhJlCUcxDVVUqASo7gLpuxVVFm7sH9ut3cP6SHbbyK7hsr0GAcsFi6PfPU3zCzFlV/sGKancDNcr8ozYXTpypwLHjp3D4yFFUXKyEQuecVXtLS3EGmJ6eQiCwAEGwFPOIxUyYplEA6YUvq/SIinrK8MFDB1BWVoaTNhvs1TXQoj/AlVZ5gtRanbC8HCeQjvGJMXi9s6Q0X04WzDA0yLR2NDbBdvosrlZV41ZDC5yuHugW0OqUou0eVqmYpolkcplgMsU4QjEWsOD3o6t3AO7+YUx6ZrDIi1j9tYY/1HEFIFAK3uuBzc1Nas01BEMhBBd5bGz8/u/OXyuqcwHf8W2FAAAAAElFTkSuQmCC')",backgroundSize:"cover",display:"block"}})),"\n  ",Object(r.b)("img",i({parentName:"span"},{className:"gatsby-resp-image-image",alt:"Reefer",title:"Reefer",src:"/refarch-kc/static/5623f21589ad4f5f8a5430d3c8b288b1/9f991/reefer.png",srcSet:["/refarch-kc/static/5623f21589ad4f5f8a5430d3c8b288b1/7fc1e/reefer.png 288w","/refarch-kc/static/5623f21589ad4f5f8a5430d3c8b288b1/a5df1/reefer.png 576w","/refarch-kc/static/5623f21589ad4f5f8a5430d3c8b288b1/9f991/reefer.png 788w"],sizes:"(max-width: 788px) 100vw, 788px",style:{width:"100%",height:"100%",margin:"0",verticalAlign:"middle",position:"absolute",top:"0",left:"0"},loading:"lazy"})),"\n    "))}b.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-pages-business-scenario-scenario-overview-index-mdx-5c6e98393ae21b680352.js.map