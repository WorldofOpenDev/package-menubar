define("src/settings",[],function(){return codebox.settings.schema("menubar",{title:"Menu Bar",type:"object",properties:{visible:{description:"Show Menu Bar",type:"boolean","default":!0}}})}),define("src/defaults",[],function(){return[{caption:"Codebox",items:[{caption:"Welcome",command:"application.welcome"},{caption:"About",command:"application.about"},{caption:"Releases Notes",command:"application.changes"}]},{caption:"File",items:[{caption:"New File",command:"file.open"},{caption:"Save",command:"editor.save"},{caption:"Save All",command:"editor.save.all"}]},{caption:"View",items:[{caption:"Toggle Menu Bar",command:"view.menubar.toggle"}]},{caption:"Help",items:[{caption:"Documentation",command:"application.help"},{caption:"Send Feedback",command:"application.feedback"}]}]}),define("src/items",[],function(){var e=codebox.require("hr/hr"),t=codebox.require("hr/utils"),n=e.Model.extend({defaults:{caption:"",command:"",items:[]},initialize:function(){n.__super__.initialize.apply(this,arguments),this.items=new r,this.listenTo(this,"change:items",function(){this.items.reset(this.get("items"))}),this.items.reset(this.get("items"))}}),r=e.Collection.extend({model:n});return r}),define("src/bar",["src/settings","src/defaults","src/items"],function(e,t,n){var r=codebox.require("hr/hr"),i=codebox.require("hr/dom"),s=codebox.require("hr/utils"),o=r.List.Item.extend({className:"menuitem",events:{"click  >.caption":"click"},initialize:function(){o.__super__.initialize.apply(this,arguments),this.bar=this.parent.bar,this.menu=null,this.$caption=i("<span>",{"class":"caption"}),this.$caption.appendTo(this.$el),this.listenTo(this.bar,"close:menu",function(){this.close()})},prepareMenu:function(){if(this.menu)return;this.menu=new u({collection:this.model.items,bar:this.bar},this),this.menu.appendTo(this)},render:function(){return this.$caption.text(this.model.get("caption")),this.ready()},click:function(e){console.log("open menu item",this.model.get("caption"),this.model.items.size()),this.model.items.size()>0&&(e.stopPropagation(),this.prepareMenu(),this.bar.closeAllMenus(),this.$el.toggleClass("active",!0))},close:function(e){this.$el.toggleClass("active",!1)}}),u=r.List.extend({className:"menubar-menuitems",Collection:n,Item:o,initialize:function(){this.bar=this.options.bar,u.__super__.initialize.apply(this,arguments)}}),a=r.View.extend({className:"component-menubar",initialize:function(){var n=this;a.__super__.initialize.apply(this,arguments),this.MenuList=u,this.items=new u({bar:this},this),this.items.appendTo(this),this.listenTo(e.data,"change",this.onSettingsChange),this.onSettingsChange(),this.items.collection.reset(t),i(document).on("click",this.closeAllMenus.bind(this))},closeAllMenus:function(){this.trigger("close:menu")},onSettingsChange:function(){codebox.app.$el.toggleClass("hide-menubar",!e.data.get("visible"))}});return a}),define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!src/stylesheets/main",[],function(){}),define("src/index",["src/settings","src/bar","less!src/stylesheets/main.less"],function(e,t){var n=codebox.require("core/commands"),r=codebox.require("utils/dialogs"),i=new t;i.appendTo(codebox.app.$el),n.register({id:"view.menubar.toggle",title:"View: Toggle Menu Bar",shortcuts:["mod+b","mod+k"],run:function(){e.data.set("visible",!e.data.get("visible")),codebox.settings.save()}}),codebox.menubar=i}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}('.pull-right {\n  float: right !important;\n}\n.pull-left {\n  float: left !important;\n}\n.hidden {\n  display: none !important;\n  visibility: hidden !important;\n}\n.component-menubar {\n  position: fixed;\n  top: 0px;\n  right: 0px;\n  left: 0px;\n  z-index: 10;\n  height: 24px;\n  padding: 0px 0px;\n  background: #131313;\n  color: #b8b8b8;\n  line-height: 24px;\n}\n.component-menubar .menubar-menuitems {\n  list-style: none;\n  margin: 0px;\n  padding: 0px;\n}\n.component-menubar .menubar-menuitems:before,\n.component-menubar .menubar-menuitems:after {\n  content: " ";\n  display: table;\n}\n.component-menubar .menubar-menuitems:after {\n  clear: both;\n}\n.component-menubar .menubar-menuitems .menuitem {\n  float: left;\n  padding: 0px 6px;\n  position: relative;\n}\n.component-menubar .menubar-menuitems .menuitem > .menubar-menuitems {\n  position: absolute;\n  top: 100%;\n  left: 0px;\n  background: #131313;\n  display: none;\n}\n.component-menubar .menubar-menuitems .menuitem > .menubar-menuitems .menuitem {\n  float: none;\n  min-width: 200px;\n}\n.component-menubar .menubar-menuitems .menuitem.active > .caption {\n  color: #c0c5ce;\n}\n.component-menubar .menubar-menuitems .menuitem.active > .menubar-menuitems {\n  display: block;\n}\n.main-application > .main-grid {\n  top: 24px;\n}\n.main-application.hide-menubar > .main-grid {\n  top: 0px;\n}\n.main-application.hide-menubar .component-menubar {\n  display: none;\n}\n');