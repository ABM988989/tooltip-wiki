// Get all the links that are in the DIV of the post.

const classPost = 'entry-content'; // Change it, to the class of the element of the post content.

let links = document.getElementsByClassName(classPost)[0].getElementsByTagName('a');


// Loop through all the links, and add a mouse-event to them.
for (const link of links){
    link.addEventListener('mouseenter', showTooltip);
    link.addEventListener('mouseout', () => {

        // Cancel for all other setTimeout.
        clearTimeout(delayTimer);

    });

}

// Set variable for setTimeout. 
let delayTimer;


// Show Tooltip. 
function showTooltip(event) {


    // Post URL.
    let post_url = event.target.getAttribute('href');

    // Check if this URL is Internal link.
    let domain_link = new URL(post_url);
    domain_link = domain_link.hostname;
    if ( window.location.hostname != domain_link) {
        return;
    }

    // Cancel for all other setTimeout.
    clearTimeout(delayTimer);

    // Remove all existing Tooltips.
    document.querySelectorAll('.tooltip-main').forEach( (tooltips) => tooltips.remove() );


    delayTimer = setTimeout(() => {


        // Create Tooltip Main Element:
        let tooltipMain = document.createElement('DIV');
        tooltipMain.classList.add('tooltip-main');

        
        // Position Tooltip on Screen:

        // Y 
        if ( ( window.innerHeight / 2 )  > event.clientY ) {
            tooltipMain.style.top = event.layerY + 'px';
        } else {
            tooltipMain.style.top = event.layerY - 460 + 'px';
        }

        // X 
        if ( ( window.innerWidth / 2 )  > event.clientX ) {
            tooltipMain.style.left = event.layerX + 'px';

        } else {
            tooltipMain.style.left = event.layerX - 300 + 'px';
        }
    
     
        // Create Tooltip Content Element
        let tooltipContent = document.createElement("A");
        tooltipContent.classList.add('tooltip-content');
        tooltipMain.appendChild(tooltipContent);
        document.getElementsByTagName('body')[0].appendChild(tooltipMain);


        // AJAX Request.
        const data = new FormData();
        data.append( 'action', 'tooltip_action' );
        data.append( 'post_url', post_url );
        data.append( 'nonce', readmelater_ajax.nonce );
        
        fetch(readmelater_ajax.ajax_url, {
            method: "POST",
            credentials: 'same-origin',
            body: data
        })
        .then((response) => response.json())
        .then((response) => {


            // Add Content to Tooltip Element:

                // href
                tooltipContent.setAttribute('href', response.data.post_parmalink);

                // Image
                let tooltipImg = document.createElement("IMG");
                tooltipImg.classList.add('tooltip-img');
                tooltipImg.setAttribute('src', response.data.post_img);
                tooltipContent.appendChild(tooltipImg);

                // Title
                let tooltipTitle = document.createElement("H3");
                tooltipTitle.classList.add('tooltip-title');
                let titlenode = document.createTextNode(response.data.post_title);
                tooltipTitle.appendChild(titlenode);
                tooltipContent.appendChild(tooltipTitle);     

                // node text
                let textnode = document.createTextNode(response.data.post_contect);
                tooltipContent.appendChild(textnode);
        


            // Add Event for Remove Tooltip on mouse leave tooltip.
            tooltipMain.addEventListener('mouseleave',(e) => { 
                e.target.remove()
            });
    
            
        })
        .catch((error) => {
        console.error(error);
        });          

    }, 1000);
    
}
