/*
	STEPS TO COPY:
	(Complete these to make the JavaScript work)

	STEP 1. Add Zonelets compatibility functions and ZoneletsNavboxes initialization underneath "BEGINNING OF MORE ADVANCED SECTION" warning
	STEP 2. Replace old Zonelets code with modifications
	STEP 3. Add generaiton/population functions to bottom of ==[ 3. GENERATING THE HTML SECTIONS TO BE INSERTED ]==
	STEP 4. Add insertion checks to bottom of ==[ 4. INSERTING THE SECTIONS INTO OUR ACTUAL HTML PAGES ]==
	STEP 5. (If you haven't done this already) add the code from zlNavboxes.html and zlNavboxes.css to your HTML and CSS
	STEP 6. Add some tags to your posts array!

	Adding tags to your postsArray:

		Let's say your postsArray looks like this:
			let postsArray=[
				[ "posts/2026-04-11-Pokemon-Champions.html" ],
				[ "posts/2026-03-31-Yume-Nikki.html" ],
				[ "posts/2026-02-10-Sonic-CD.html" ],
				[ "posts/2025-07-19-Pipistrello.html", encodeURI( 'Pipistrello and the Cursed Yoyo' ) ],
				[ "posts/2025-06-29-Pokemon-Sun-Moon.html", encodeURI( 'Pokémon Sun & Moon' ) ],
				[ "posts/2025-06-14-To-a-T.html", encodeURI( 'to a T' ) ],
			]

		You can add an array of tags to the end of any of these elements:
			let postsArray=[
				[ "posts/2026-04-11-Pokemon-Champions.html", ["pokemon", "nintendo"] ],
				[ "posts/2026-03-31-Yume-Nikki.html", ["rpgmaker", "indie"] ],
				[ "posts/2026-02-10-Sonic-CD.html", ["sega", "sonic"] ],
				[ "posts/2025-07-19-Pipistrello.html", encodeURI( 'Pipistrello and the Cursed Yoyo' ), ["indie"]],
				[ "posts/2025-06-29-Pokemon-Sun-Moon.html", encodeURI( 'Pokémon Sun & Moon' ), ["pokemon", "nintendo"]],
				[ "posts/2025-06-14-To-a-T.html", encodeURI( 'to a T' ), ["indie"] ],
			]
		Note you can have as few as 1 tags. Avoid putting empty arrays like [] or [""] or ["", "", ...] as a placeholder.
		
		You might not want every post to have tags, and they are still optional in your postsArray.
		However, you must always add the tags to the end of the post array:
			CORRECT ELEMENT EXAMPLES:
				[ "posts/2026-04-11-Pokemon-Champions.html"]
				[ "posts/2026-03-31-Yume-Nikki.html", ["rpgmaker", "indie"]]
				[ "posts/2025-07-19-Pipistrello.html", encodeURI( 'Pipistrello and the Cursed Yoyo' ), ["indie"]],
				[ "posts/2025-06-29-Pokemon-Sun-Moon.html", encodeURI( 'Pokémon Sun & Moon' )],

			WRONG ELEMENT EXAMPLES:
			(These will yield unexpected results)
				[ encodeURI('Pokemon Champions'), "posts/2026-04-11-Pokemon-Champions.html"]
				[  ["rpgmaker", "indie"], "posts/2026-03-31-Yume-Nikki.html"]
				[ "posts/2025-07-19-Pipistrello.html", ["indie"], encodeURI( 'Pipistrello and the Cursed Yoyo' )],
				[ ["pokemon", "nintendo"], "posts/2025-06-29-Pokemon-Sun-Moon.html", encodeURI( 'Pokémon Sun & Moon' )],

		Tags themselves can be any valid JavaScript string. Your mileage may very with emoji and certain unicode characters.

*/



//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// STEP 1. Zonelets compatibility functions and tag_map initialization
// Paste the following at the top of the advanced section, right underneath the "BEGINNING OF MORE ADVANCED SECTION" warning where the second //XXX... row appears.
// zlNavboxes zonelets compatibility functions and initialization
function tagSafeDecodeURI(post_index) {	// Make sure we decode a URI, not an array or title // with this function, there are cases where [i][1] = tag array [i][2] = undefined, [i][1] = uri [i][2] = tag array
	if ( Array.isArray(postsArray[post_index][1]) ) return decodeURI(postsArray[post_index][2]);
	return decodeURI(postsArray[post_index][1])
}
function alternateTitleExists(post_index) { // not very happy with this existing i want to nuke it but it works for now. i imagine this will fuck up other zonelets mods
		if ((postsArray[post_index].length > 1)
			&& ( (typeof(postsArray[post_index][1]) == "string")
				|| (typeof(postsArray[post_index][2]) == "string"))
			) return true;
		return false;
}
function getPostsArrayIndex(postIndex){
	let element_position;
	if (postsArray[postIndex].length > 1) {
		element_position = 1;
		if(postsArray[postIndex][2]) element_position = 2;
	}
	return element_position;
}

	// generate map of tags
	// determine what tags are in use and what posts (by index) have tags
	// 
	let tags_map = new Map();
	for (let i = 0; i < postsArray.length; i++) {
		let current_postIndex = i;
		let current_postSet = new Set();

		if (postsArray[i].length > 1) {

			let element_position = 1
			if(postsArray[i][2]) element_position = 2;

			if(Array.isArray(postsArray[i][element_position])){
				// associate post with tag in tag map
				for(let ii = 0; ii < postsArray[i][element_position].length; ii++){
					let current_tagName = postsArray[i][element_position][ii];

					if (tags_map.has(current_tagName)) {
						current_postSet = tags_map.get(current_tagName);

						if (!current_postSet.has(current_postIndex)) {		
							current_postSet.add(current_postIndex);
							tags_map.set(current_tagName, current_postSet);
						}
					} else {
						tags_map.set(current_tagName, new Set([current_postIndex]));
					}
				}
			}
		}
	}	

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// STEP 2. Modified Zonelets code
// Replace these functions with the existing functions in your script.js

function formatPostTitle(i) { 		// modified from original
	// Check if there is an alternate post title
	if (alternateTitleExists(i)) {
		//Remember how we had to use encodeURI for special characters up above? Now we use decodeURI to get them back.
		return tagSafeDecodeURI(i);
	} else { 
	//If there is no alternate post title, check if the post uses the date format or not, and return the proper title
		if (  postDateFormat.test ( postsArray[i][0].slice( 6,17 ) ) ) {
		return postsArray[i][0].slice(17,-5).replace(/-/g," ");
		} else {
		return postsArray[i][0].slice(6,-5).replace(/-/g," ");
		}
	}
}
	//Generate the Post List HTML, which will be shown on the "Archive" page.
function formatPostLink(i, noDates_flag) { 		// modified from original
	let postTitle_i = "";
	if (alternateTitleExists(i)) {
		postTitle_i = tagSafeDecodeURI(i);
	} else {
		if (  postDateFormat.test ( postsArray[i][0].slice( 6,17 ) ) ) {
			postTitle_i = postsArray[i][0].slice(17,-5).replace(/-/g," ");
		} else {
			postTitle_i = postsArray[i][0].slice(6,-5).replace(/-/g," ");
		}
	}
	
	if (  postDateFormat.test ( postsArray[i][0].slice( 6,17 ) )  && !noDates_flag) {
		return '<li><a href="' + relativePath + '/'+ postsArray[i][0] +'">' + postsArray[i][0].slice(6,16) + " \u00BB " + postTitle_i + '</a></li>';
	} else {
		return '<li><a href="' + relativePath + '/'+ postsArray[i][0] +'">' + postTitle_i + '</a></li>';
	}
	
}


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// STEP 3. Propagation (uh is that the right word) functions		// I'm really good at misusing words
// Add these functions to the end of the ==[ 3. GENERATING THE HTML SECTIONS TO BE INSERTED ]== section, just below what's already there.
// zlNavboxes Propagation functions
	// determine what tags are in use and what posts (by index) have tags
function generateCommaList(ia) {	// ia = Input Array
	let fragment = document.createElement("ul");
	fragment.classList.toggle("commaList");
	for (let i = 0; i < ia.length; i++) {
		let temp_li = document.createElement("li");
		temp_li.innerHTML = ia[i];
		fragment.appendChild(temp_li);
	}
	
	return fragment;
}

	// render a navbox row given a tag
function generateTagRow(tagName) {
	let title = tagName;
	let posts;
	if (tags_map.has(tagName)) posts = Array.from(tags_map.get(tagName));
	else return;

	posts.sort(); // just gonna assume we want these to be alphabetical no matter what
	
		// generate HTML and return fragment
	let title_cell = document.createElement("th");
	let posts_cell = document.createElement("td");		

	title_cell.innerHTML = title;
	let links_cell = document.createElement("td");
	let	links_list = document.createElement("ul");
	for (let i = 0; i < posts.length; i++) {
		links_list.innerHTML += formatPostLink(posts[i], "don't add dates, you baka!");
	}	

	links_cell.appendChild(links_list);
	
	let fragment = document.createElement("tr");
	fragment.appendChild(title_cell);
	fragment.appendChild(links_cell);
	
	return fragment;
}


	// determine what navboxes to render given the page and render them 		NOTE: this might get funky with multiple navboxes on a page (see next comment)
function populateNavbox(nb) {	//TODO: make this not dependent on IDs, they should be classes
	// initialize table for DOM manipulation and remove no-js error(s)
	let getRidOfMe = document.getElementsByClassName('zlnavboxes_js_error');
	if (getRidOfMe){
		for (let i = 0; i < getRidOfMe.length; i++)
		getRidOfMe[i].remove();
	}

	// then do the inserting/generating/creating/setting/appending/getting yknow
	if(nb.id == "related"){
		let temp_ta = postsArray[currentIndex][getPostsArrayIndex(currentIndex)];
		if (temp_ta.length > 1) {
			for (tag of temp_ta) nb.querySelector('tbody').appendChild(generateTagRow(tag));
		} else if (temp_ta.length !== 0) {
			nb.querySelector('tbody').appendChild(generateTagRow(temp_ta[0]));
		}			

	} else if (nb.id == "posts" || nb.id == "tags" || nb.id == "all") {
		// render all tags row, if requested
		if(nb.id == "all" || nb.id == "tags") {
			let temp_row = document.createElement("tr");
			temp_row.setAttribute("colspan", "2");
			let temp_td = document.createElement("td");
			temp_td.setAttribute("colspan", "2");
			let temp_list = document.createElement("ul");

			for (tag of tags_map.keys()) {
				let temp_li = document.createElement("li");
				temp_li.innerHTML = tag;
				temp_list.appendChild(temp_li);
			}

			temp_td.appendChild(temp_list);
			temp_row.appendChild(temp_td);

			nb.querySelector('tbody').appendChild(temp_row);
		}
		// render all posts sorted by tag, if requested
		if(nb.id == "all" || nb.id == "posts") {
			for (tag of tags_map.keys()) {
				nb.querySelector('tbody').appendChild(generateTagRow(tag));
			}					
		}

	}
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// STEP 4. Insertion Checks
// Add these insertion checks to the bottom of the ==[ 4. INSERTING THE SECTIONS INTO OUR ACTUAL HTML PAGES ]== section, just below what is already there
if(document.getElementsByClassName("navbox")) {
	let navboxes = document.getElementsByClassName("navbox");
	for (let nb = 0; nb < navboxes.length; nb++) populateNavbox(navboxes[nb]);
}

if(document.getElementById("postTags")){ 	// TODO: make this not render if a posts has the table 
	if (getPostsArrayIndex(currentIndex)) {
		document.getElementById("postTags").appendChild(
			generateCommaList(
				postsArray[currentIndex][getPostsArrayIndex(currentIndex)]
			)
		);
	}
}

// Now add some tags to your postsArray!