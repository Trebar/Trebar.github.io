//Currently drawing things in DOM. Not sure if I like that, but for now it is the case.
//var ctx = document.getElementById("ctx").getContext("2d");

/*Global Game Variables
These will be tracked across the game as a whole
*/
var currentStoryPage = 1;
var maxStoryPage = 3;
var storyPageUnlocked = true;
var studyPageUnlocked = false;
var researchPageUnlocked = false;
var flowersPageUnlocked = false;
var storePageUnlocked = false;
var nextFeaturePageUnlocked = false;
var gold = 0;
var knowledge = 0;
var autoGold = false;
var _menuButtons = [];
var _gamePages = [];

/*Global Functions*/
{
clickMenuButton = function(type){
	var temp = type+"Unlocked";
	if(window[temp]){
		for(var item in _gamePages){ 
			_gamePages[item].hidden = true;
		}
		document.getElementById(type).hidden = false;
	}
}

unlockMenu = function(type){ //currently assumes type is XXXXButton. TOD): Find better control mechanism
	var temp = document.getElementById(type);
	window[type.substring(0,type.length-6)+"PageUnlocked"] = true;
	temp.className = "menuButton";
	temp.innerText = type.substring(0,type.length-6);
}

setStoryPage = function(){
	var temp = document.getElementsByName("storyPage");
	for (i = 0; i<temp.length; i++){
		if(temp[i].id == currentStoryPage)
			temp[i].hidden = false;
		else
			temp[i].hidden = true;
	}
	if(!studyPageUnlocked && currentStoryPage == 3 && maxStoryPage == 3) //TODO Find a better way to control this
		unlockMenu("studyButton");
}

saveGame = function(){
	var save = { //create dave data
		_currentStoryPage: currentStoryPage,
		_maxStoryPage: maxStoryPage,
		_studyPageUnlocked: studyPageUnlocked,
		_researchPageUnlocked: researchPageUnlocked,
		_flowersPageUnlocked: flowersPageUnlocked,
		_storePageUnlocked: storePageUnlocked,
		_nextFeaturePageUnlocked: nextFeaturePageUnlocked,
		_gold: gold,
		_knowledge: knowledge,
		_autoGold: autoGold
	}
	console.log(save);
	localStorage.setItem("save",JSON.stringify(save)); //store save data
}
loadGame = function(){
	var save = JSON.parse(localStorage.getItem("save")); //retrieve save data
	console.log(save);
	//load save data
	if (typeof save._currentStoryPage !== "undefined") currentStoryPage = save._currentStoryPage;
	if (typeof save._maxStoryPage !== "undefined") maxStoryPage = save._maxStoryPage;
	if (typeof save._studyPageUnlocked !== "undefined") studyPageUnlocked = save._studyPageUnlocked;
	if (typeof save._researchPageUnlocked !== "undefined") researchPageUnlocked = save._researchPageUnlocked;
	if (typeof save._flowersPageUnlocked !== "undefined") flowersPageUnlocked = save._flowersPageUnlocked;
	if (typeof save._storePageUnlocked !== "undefined") storePageUnlocked = save._storePageUnlocked;
	if (typeof save._nextFeaturePageUnlocked !== "undefined") nextFeaturePageUnlocked = save._nextFeaturePageUnlocked;
	if (typeof save._gold !== "undefined") gold = save._gold;
	document.getElementById("goldCounter").innerHTML = gold;
	if (typeof save._knowledge !== "undefined") knowledge = save._knowledge;
	document.getElementById("knowledgeCounter").innerHTML = knowledge;
	if (typeof save._autoGold !== "undefined"){ autoGold = save._autoGold; goldFlowerClickable = false;}
	
	if(storyPageUnlocked) unlockMenu("storyButton");
	if(studyPageUnlocked) unlockMenu("studyButton");
	if(researchPageUnlocked) unlockMenu("researchButton");
	if(flowersPageUnlocked) unlockMenu("flowersButton");
	if(storePageUnlocked) unlockMenu("storeButton");
	if(nextFeaturePageUnlocked) unlockMenu("nextFeatureButton");
}

deleteSave = function(){
	localStorage.removeItem("save");
}
}
/*Set Up Game*/

//Left Menu Set Up
{
var saveButton = document.getElementById("saveButton");
	saveButton.addEventListener("click", saveGame);
var loadButton = document.getElementById("loadButton");
	loadButton.addEventListener("click", loadGame);
var deleteButton = document.getElementById("deleteButton");
	deleteButton.addEventListener("click", deleteSave);
}
//Menu Set Up
{
var storyButton = document.getElementById("storyButton");
	_menuButtons.push(storyButton);
var studyButton = document.getElementById("studyButton");
	_menuButtons.push(studyButton);
var researchButton = document.getElementById("researchButton");
	_menuButtons.push(researchButton);
var flowersButton = document.getElementById("flowersButton");
	_menuButtons.push(flowersButton);
var storeButton = document.getElementById("storeButton");
	_menuButtons.push(storeButton);
var nextFeatureButton = document.getElementById("nextFeatureButton"); //TODO Refactor this name
	_menuButtons.push(nextFeatureButton);
	
_menuButtons.forEach(function(item){
	var temp = item.id;
	temp = temp.substring(0, temp.length-6);
	temp = temp+"Page";
	item.addEventListener("click", function(){clickMenuButton(temp)});
});
}

//Page Set Up
{
var storyPage = document.getElementById("storyPage");
	_gamePages.push(storyPage);
var studyPage = document.getElementById("studyPage");
	_gamePages.push(studyPage);
var researchPage = document.getElementById("researchPage");
	_gamePages.push(researchPage);
var flowersPage = document.getElementById("flowersPage");
	_gamePages.push(flowersPage);
var storePage = document.getElementById("storePage");
	_gamePages.push(storePage);
var nextFeaturePage = document.getElementById("nextFeaturePage");
	_gamePages.push(nextFeaturePage);
}
//StoryPage Setup
{
document.getElementById("backStory").addEventListener("click", function(){if(currentStoryPage>1)currentStoryPage--;setStoryPage()});
document.getElementById("forwardStory").addEventListener("click", function(){if(currentStoryPage<maxStoryPage)currentStoryPage++;setStoryPage()});
}

{//StudyPage Setup
//TODO: Pull string from a list rather than making it a static variable
var snippet = "Please type the text snippet. Correct entries gain knowledge; mis-types lose knowledge. In the full game, there will be different lines. For now, it's a one-off... and it will guarantee enough knowledge to RESEARCH";
//var snippet = "RESEARCH";
var snippetText = document.getElementById("snippetText");
var typedText = "";
snippetText.innerText = snippet;

updateText = function(event){
	if(!studyPage.hidden){
		var temp = snippet.split("");
		if(event.key == temp[0]){
			typedText += temp[0];
			snippet = snippet.substring(1);
			snippetText.innerHTML = "<span style=\"color:Green; font-weight:Bold\">"+typedText+"</span>"+snippet;
			knowledge += 1;
		} else{
			knowledge -= 1;
			if(knowledge <0){
				knowledge = 0;
			}
		}
		//temporarily set to 5000 knowledge if phrase is completed TODO: Remove this section
		if(snippet.length == 0){
			knowledge = 5000;
			unlockMenu("researchButton");
			document.removeEventListener("keypress", updateText);
		}
		document.getElementById("knowledgeCounter").innerText = knowledge;
	}
}

document.addEventListener("keypress", updateText);
}

/*Research Setup*/
{
	{ //Buy Gold Flower
		var buyGoldFlowerButton = document.getElementById("buyGoldFlower");
		buyGoldFlower = function(){
			if(flowersPageUnlocked == false && knowledge >= 3000){
				knowledge -= 3000;
				unlockMenu("flowersButton");
			}
		}
		buyGoldFlowerButton.addEventListener("click", buyGoldFlower);
	}
}

{//flowers Page Setup
	{
		{/* goldFlower Setup 
	TODO: Make sure graphics are better handled than just name and display
	Currently separate values because I'm using DOM to draw buttons, but then I don't have instance variables
	*/
	var goldFlower = document.getElementById("goldFlower");
	var goldFlowerCountdown = 0;
	var goldFlowerClickable = true;
	var goldPerClick = 1;
	clickGold = function(number){
		if(goldFlowerClickable = true){
			gold = gold+number;
			document.getElementById("goldCounter").innerHTML = gold;
			goldFlower.className = 'goldFlower2' //temporary naming scheme. Will just be an animation later
			goldFlowerClickable = false;
			goldFlowerCountdown = 50;
			goldFlower.innerText = "Growing"; //temporary display
			
			//TODO: Remove the below to a better unlock place
			if(gold == 10){
				unlockMenu("storeButton");
			}
		}
	}
	goldFlower.addEventListener("click", function(){clickGold(goldPerClick)});
	}
}
}

/*Shop Setup*/
{
	{ //Gold flowers Picker
		var buyflowersPickerButton = document.getElementById("buyflowersPicker");
		buyflowersPicker = function(){
			if(autoGold == false && gold >= 10){
				gold -= 10;
				autoGold = true;
				clickGold(goldPerClick);
			}
		}
		buyflowersPickerButton.addEventListener("click", buyflowersPicker);
	}
	{ //Temporary "Buy Next Feature" button
		var buyNextFeatureButton = document.getElementById("buyNextFeature"); //TODO Refactor this button name
		buyNextFeature = function(){
			if(nextFeaturePageUnlocked == false && gold >= 100){
				gold -= 100;
				unlockMenu("nextFeatureButton");
				nextFeatureButton.className = "menuButton";
			}
		}
		buyNextFeatureButton.addEventListener("click", buyNextFeature);
	}
}

/*
Update Function to generate frames per second for calculation.

Currently set to 50 frames per second
*/
update = function(){
	//Gold Button growth
	if(goldFlowerClickable == false && goldFlowerCountdown > 0){
		goldFlowerCountdown--;
	}
	else if(goldFlowerCountdown == 0){
		goldFlower.className = 'goldFlower1'
		goldFlower.innerText = "Harvest";
		goldFlowerClickable = true;
		goldFlowerCountdown = 50;
		if(autoGold){
			clickGold(goldPerClick);
		}
	}
	
}

window.setInterval(update, 20); //50 frames per second