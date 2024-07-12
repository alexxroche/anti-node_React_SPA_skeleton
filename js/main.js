// state that tells us which page is loaded
// React.useState doesn't work, and isn't needed
let current_page = '';
if ('page' in  localStorage){
    current_page = localStorage.getItem('page');
    //console.log('[d:get] page: ' + current_page);
}else{
    //const current_page = localStorage.getItem('page', JSON.stringify(page));
    current_page = "splash";
    localStorage.setItem("page", current_page);
    //console.log('[d:set] page: ' + current_page);
}

//console.log('[d] p: ' + JSON.stringify(pages));
// this is an exhaustive list of possible pages
// faults and errors loads the splash page
function valid_page(p) {
  for (r in pages){
    //console.log('[d:vp-test] is ' + p + ' a valid page? for "' + r + '"' );
    /*
    if ( 5 == r ){
        console.log('[d:vp::DUMP¬] "' + p + '": ' + JSON.stringify(pages[r]));
    }
    */
    if ( undefined === p ){
       // console.log('[w:vp:null] ' + p + ' is null');
        return false
    }
    //{id: 5, name: 'FAQs', header:true, footer:true, page: 'faq', v:faqs},
    if ( pages[r] && (Object.hasOwn(pages[r], 'page')) ){
       // console.log('[d:vpn1] is "' + p + '" an exiting page page? "' + pages[r].page.toLowerCase() + '" === "' + p + '"');
        if ( pages[r].page.toLowerCase() === p){
            //console.log('[d:vpn2] ' + p + ' IS a valid page');
            return true
        }
        if ( pages[r].name.toLowerCase() === p ){
            //console.log('[d:vpn0] ' + p + ' IS also valid page');
            return true
        }
    }else if ( pages[r] && (Object.hasOwn(pages[r], 'name')) ){
        //console.log('[d:vpp1] is "' + p + '" a valid PAGE name?');
        if ( pages[r].name.toLowerCase() === p ){
           // console.log('[d:vpp] ' + p + ' IS a valid page');
            return true
        }
    //}else{
    //    console.log('[d:45] ' + pages[r] + ' does not contain != ' + p);
    }
  }
 // tHese are the only valid pages
 // each oen is it own React var
};

function forceUpdate(current_page) {
    this_url=window.location.href;
    const pfu=this_url.split("?");
    page_from_url='splash';
    if (typeof(pfu) != 'undefined' && pfu != null && pfu.length >= 2){
        page_from_url=pfu[1].replace(/[^a-z]/gm,"");
    }
    //console.log('[d:fu77] page_from_url! ' + page_from_url);
  // limit valid pages to VALID pages
  if( ! valid_page(current_page) ){
    //console.log('[d80] current_page ' + current_page + ' is NOT valid');
    if( valid_page(page_from_url) ){
    //console.log('[d82] current_page ' + current_page + ' is NOT valid, switching to ' + page_from_url);
        current_page = page_from_url;
    }else{
    //    console.log('[d84] current_page ' + current_page + ' is NOT valid, switching to SPLASH');
        current_page = 'splash';
    }
  }
   localStorage.setItem("page", current_page);
  let root = document.getElementById('main');
  if( 'splash' === current_page){
    root = document.getElementById('root');
  }
  // update the URL bar
  const stateObj = { page: current_page };
  history.pushState(stateObj, "", '?' + current_page);

  // update meta
  const URI = window.location.href ? window.location.href : document.URL;


  const kw = "antinode React SPA skeleton";
  if ( document.getElementsByTagName('meta')["keywords"] ){
    document.getElementsByTagName('meta')["keywords"].content = kw;
  }else{
     var mkw = document.createElement('meta');
    mkw.setAttribute('content', kw);
    document.head.appendChild(mkw);
  }
  const desc = "A SPA using React and no NPM!!";
  if ( document.getElementsByTagName('meta')["description"] ){
    document.getElementsByTagName('meta')["description"].content = desc;
  }else{
     var md = document.createElement('meta');
    md.setAttribute('description', desc);
    document.head.appendChild(md);
  }

document.title = "SPA React Skeleton";

//document.getElementsByTagName('link')[rel="canonical"].href = URI + '/?' + current_page;
var link = !!document.querySelector("link[rel='canonical']") ? document.querySelector("link[rel='canonical']") : document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', location.protocol + '//' + location.host + location.pathname + '?' + current_page);
  document.head.appendChild(link);


  const r = ReactDOM.render(
         //eval(current_page), // don't use eval, it's evil!
         fetch_page(current_page),
          root
  );
  //console.log('[d:fu-after] ' + JSON.stringify(pages[current_page]) );
  //console.log('[d:fu-after] ' + current_page + '; ' + page_from_url );
};

    /*
    if ( on_splash ){
     var b = document.getElementById('body');
     let timeout = null;
     b.addEventListener('keyup', function (e) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            forceUpdate('welcome');
        }, 5000);
     });
    }
    */

function setPage(page) {
    var current_page = page.toLowerCase();
    //console.log('[d:setting] loading page : ' + page + '; with : ' + current_page);
    let previous_page = localStorage.getItem('page');
    //console.log('[d:was] page: ' + previous_page);
    var set_page = localStorage.setItem("page", current_page);
    let new_page = localStorage.getItem('page');
    //console.log('[d:is] page: ' + new_page);
    forceUpdate(current_page);
};

///////////////////////////////////////
//  The "pages" are defined here and //
// configured below for each page    //
///////////////////////////////////////

const pages = [
    // N.B. Order currently determins which order they are listed,
    // in the navbars, NOT the page id:
    {id: 1, name: 'Welcome', header:true, footer:true, v:null},
    {id: 2, name: 'Gallery', header:true, footer:true, v:null},
    {id: 3, name: 'Contact', header:true, footer:true, v:null},
    {id: 4, name: 'FAQs',  header:true, footer:true, page: 'faq', v:null},
    {id: 5, name: 'About', footer:true, v:null},
    {id: 0, name: 'Splash', header:false, footer:false, v:null},
];
//console.log('[d:340] p: ' + JSON.stringify(pages));

const footer_list_items = pages.map(function(item) {
    if ( item.footer && true === item.footer){ return React.createElement('li', { id:"fli_" + item['name'].toLowerCase() , key: item.id, className: 'nav-item'}, React.createElement('a', {href: '?' + item['name'].toLowerCase(), id: 'footer_' + item['name'].toLowerCase(),  onClick: () => setPage(item['name']), className: 'nav-link px-2 text-body'}, item.name ))}});
const header_list_items = pages.map(function(item) {
    if ( item.header && true === item.header){ return React.createElement('li', { id:"hli_" + item['name'].toLowerCase() , key: item.id, className: 'nav-item'}, React.createElement('a', {href: '?' + item['name'].toLowerCase(), id: 'footer_' + item['name'].toLowerCase(),  onClick: () => setPage(item['name']), className: 'nav-link px-2 text-body'}, item.name ))}});

const top_navbar_title =
  React.createElement(
    'a',
    {href: "https://github.com/alexxroche/anti-node_React_SPA_skeleton"},
    'Example');

let top_navbar =
  React.createElement(
    'nav',
    { className: "navbar navbar-expand-md mt-auto py-3 fixed-top bg-body-tertiary"},
  React.createElement(
    'div',
    {className:"container-fluid"},
  React.createElement(
    'div',
    {className:"container"},
  React.createElement(
    'header',
    { className:"d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-0 mb-0"},
  React.createElement(
    'div',
      { id:"header_left_pad", className:"col-md-2 mb-0 mb-md-0"},
      top_navbar_title
    ),
    React.createElement(
     'ul',
     { className: "nav col-12 col-md-auto mb-2 justify-content-center border-bottom mb-md-0"},
     header_list_items
    ),
    React.createElement(
    'div',
    {className: "col-md-3 text-end"},
      // Buttons for private area
      React.createElement(
        'button',
       {type:"button", className:"btn btn-outline-primary me-2"},
        'Login'
      ),
      React.createElement(
        'button',
        {type:"button", className:"btn btn-primary"},
         'Join'
      )
     )
    )
   )
  )
);


const footer_copyright = '© 2024 LXR, MIT License';
let footer =
  React.createElement(
    'footer',
    { className: "footer mt-auto py-3 fixed-bottom bg-body-tertiary"},
    React.createElement(
     'div',
     { className: "container"},
    React.createElement(
     'ul',
     { className: "nav justify-content-center border-bottom pb-0 mb-0"},
     footer_list_items
    ),
    React.createElement(
     'p',
     {className: "text-center text-body-secondary"},
     footer_copyright
    ),
    React.createElement(
        'div',
        { id: "toast", key:"used_to_display_alerts_and_toast" },
        React.createElement(
        'p', {id: "page_state"}
        )
    ),
    ),
  );

let splash =
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "center top_pad"},
    React.createElement(
     'a', {href:"?welcome"},
    React.createElement(
      'Container', {fluid:"md"},
        React.createElement(
         'Row', null,
          React.createElement(
            'img',
            {
              id: "splash_img",
              src: "img/splash.webp",
              alt: "Splash Img",
              className: "center left_pad",
            }
          ),
        )
      )
    )
  );

const welcome_msg = ` `;
/* NTS replace most of welcome with a welcome_msg.map(React.createElement....) */
let welcome =
  React.createElement(
   'div',
   {id: 'top_navbar'},
   top_navbar,
   React.createElement(
    'div',
    {id: "splash_outer_div", className: "center top_pad"},
    React.createElement(
      'h1', null,
      "Welcome!",
    ),
    React.createElement(
        'p', {className: "lead", align:"left"},
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat ves',
        ' tibulum lectus mauris ultrices. Netus et malesuada fames ac. Eu ultrices vitae auctor eu augue. Non diam phasellus vestibulum lorem sed',
        'risus ultricies tristique nulla. Dolor magna eget est lorem ipsum dolor sit amet consectetur. Vulputate eu scelerisque felis imperdiet p',
        'roin fermentum. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Quis varius quam quisque id diam vel quam ele',
        'mentum pulvinar. Neque vitae tempus quam pellentesque nec. Urna condimentum mattis pellentesque id nibh tortor. Faucibus a pellentesque',
        'sit amet porttitor eget dolor morbi non. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Feugiat in ante metus dictum at temp',
        'or commodo ullamcorper a. Gravida rutrum quisque non tellus orci ac auctor augue. Quis commodo odio aenean sed adipiscing diam donec. Au',
        'gue ut lectus arcu bibendum at varius. Pellentesque habitant morbi tristique senectus et. Pharetra magna ac placerat vestibulum lectus m',
        'auris. Integer quis auctor elit sed vulputate.'
    ),
    React.createElement('nbsp'),
    React.createElement('br', null),
    React.createElement('hr', null),
    React.createElement(
        'p', {className: "lead", align:"left"},
        'Non arcu risus quis varius. Sed odio morbi quis commodo odio aenean sed adipiscing. Dignissim diam quis enim lobortis scelerisque fermen',
        'tum dui. Velit dignissim sodales ut eu sem. Pellentesque dignissim enim sit amet. Id porta nibh venenatis cras sed felis eget velit aliq',
        'uet. Mauris cursus mattis molestie a iaculis at erat pellentesque. At tellus at urna condimentum mattis pellentesque id nibh. Morbi tris',
        'tique senectus et netus et malesuada. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Feugiat scelerisque va',
        'rius morbi enim nunc faucibus. Molestie nunc non blandit massa enim. Neque volutpat ac tincidunt vitae semper quis lectus nulla. Aliquam',
        'id diam maecenas ultricies mi. Sapien pellentesque habitant morbi tristique senectus et netus. Vitae proin sagittis nisl rhoncus mattis',
        'rhoncus urna neque viverra. Id donec ultrices tincidunt arcu non sodales neque sodales ut.'
    ),
    React.createElement('i', null,
        'Eu consequat ac felis donec et. Quam adipiscing vitae proin sagittis nisl rhoncus. Maecenas sed enim ut sem viverra aliquet. Fermentum i',
        'aculis eu non diam phasellus vestibulum lorem sed. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Vulputate sapi',
        'en nec sagittis aliquam malesuada bibendum arcu vitae elementum. Hac habitasse platea dictumst quisque sagittis purus sit amet. Fames ac',
        'turpis egestas maecenas pharetra convallis. Eu nisl nunc mi ipsum faucibus vitae aliquet nec. Aenean vel elit scelerisque mauris. Nulla',
        'm vehicula ipsum a arcu cursus vitae congue. Volutpat diam ut venenatis tellus in metus vulputate eu. Faucibus in ornare quam viverra or',
        'ci. Eget felis eget nunc lobortis mattis aliquam faucibus. Commodo ullamcorper a lacus vestibulum sed arcu non. Sem nulla pharetra diam ',
        'sit amet nisl suscipit adipiscing bibendum. Ac auctor augue mauris augue neque. Facilisi morbi tempus iaculis urna id volutpat lacus lao',
        'reet non. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Dolor morbi non arcu risus quis varius quam quisque.'
    ),
    ),
    footer
  );
let about =
    React.createElement(
    'div',
    {id: 'top_navbar'},
    top_navbar,
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "center top_pad"},
    React.createElement( 'h1', null, 'About'),
    ' The pages linked from the footer do ',
    React.createElement('b', null, 'not'),
    ' have to be the same as the ones from the header! '
    ),
    React.createElement('br'),
    'RDFa:src="',
    React.createElement(
    'a', { href: 'https://github.com/alexxroche/anti-node_React_SPA_skeleton'}, 'anti-node_React_SPA_skeleton'),
    '"',
    footer
    );
let contact =
    React.createElement(
    'div',
    {id: 'top_navbar'},
    top_navbar,
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "center top_pad"},
    'This could be a contact form or just <my.address@example.com>',
    ),
    footer
    );

let gallery_auto =
    React.createElement(
    'div',
    {id: 'top_navbar'},
    top_navbar,
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "center top_pad"},
    'TODO: different gallery for each theme',
    ),
    footer
    );

let gallery_light =
    React.createElement(
    'div',
    {id: 'top_navbar'},
    top_navbar,
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "center top_pad"},
    'TODO: insert some example images',
    ),
    footer
    );

let gallery;
if ('theme' in  localStorage){
  if ('auto' === localStorage.getItem('theme')){
    gallery = gallery_auto
  }else{
    gallery = gallery_light
  }
}

let faqs =
    React.createElement(
    'div',
    {id: 'top_navbar'},
    top_navbar,
    React.createElement(
      'div',
    {id: "splash_outer_div", className: "left top_pad"},
    React.createElement('h1', {className: "center top_pad"}, 'FAQs'),
    React.createElement('br'),
    React.createElement('br'),
    'are these Frequently '
    React.createElement('i', null, 'Asked'),
    ' Questions, '
    React.createElement('br'),
    ' or Freqently ',
    React.createElement('b', null, 'Answered'),
    ' Questions ?'
    ),
    footer
    );

//////////////////////
// End of the pages //
//////////////////////

for (p in pages){
  //console.log('[d] going to try to saturate pages with the page values now that they have been defined');
  try {
    // try-catch only needed if pages defines a page that hasn't yet been created
    let page_f = new Function('return ' + pages[p].name.toLowerCase())();
    //if ( typeof eval(pages[p].name.toLowerCase()) !== 'undefined'){
    if ( typeof page_f !== 'undefined'){
        //console.log('[d] saturating ' + pages[p].name );
        //pages[p].v = eval(pages[p].name.toLowerCase());
        //pages[p].v = new Function('return ' + pages[p].name.toLowerCase())();
        pages[p].v = page_f;
    }
  } catch(e){
    //console.log('[w] FAILED to saturate ' + pages[p].name );
    continue;
  }
}

//console.log('[d:340] p: ' + JSON.stringify(pages));

function fetch_page(p) {
  for (r in pages){
    //console.log('[d:fp-test] is ' + p + ' a valid page?');
    if ( undefined === p ){
        return false
    }
    if ( pages[r] && (Object.hasOwn(pages[r], 'page')) ){
        if ( pages[r].page.toLowerCase() === p || pages[r].name.toLowerCase() === p){
            //console.log('[d:fpp] ' + p + ' IS a valid page');
            return pages[r].v // return the page value
        }
    }else if ( pages[r] && (Object.hasOwn(pages[r], 'name')) ){
        if ( pages[r].name.toLowerCase() === p ){
           //console.log('[d:fpn] ' + p + ' IS a valid page');
            return pages[r].v // return the page value
        }
    //}else{
    //    console.log('[d:fp] ' + pages[r] + ' does not contain != ' + p);
    }
  }
 // tHese are the only valid pages
 // each oen is it own React var
};

//main
(function() {
    forceUpdate();
})(); // end of 'main'
