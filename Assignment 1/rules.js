let sticks = 0;
let rocks = 0;
let pickaxe = 0;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // replace this text by the Body of the location data
        
        if(locationData.Choices) { // check if the location has any Choices
            console.log(locationData.Choices);
            for(let choice of locationData.Choices) { // loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // use the Text of the choice
                // add a useful second argument to addChoice so that the current code of handleChoice below works
            }
            if(locationData.Locked_Choices) {
                for(let choice of locationData.Locked_Choices) {
                    if (eval(choice.Condition) >= 1) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
    
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice && choice.Text == "Table") {
            this.engine.gotoScene(Table, choice.Target);
        } else if (choice && choice.Text == "Pick Up Rock") {
            rocks += 1;
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else if (choice && choice.Text == "Pick Up Stick") {
            sticks += 1;
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Table extends Location {
    handleChoice(choice) {
        if (choice.Text == "Make Pickaxe") {
            if (sticks >= 2 && rocks >= 3) {
                pickaxe += 1;
                sticks -= 2;
                rocks -= 3;
                
                this.engine.show("&gt; "+"Pickaxe made!");
                this.engine.gotoScene(Table, "Crafting Table");
            } else {
                this.engine.show("&gt; "+"You do not have enough material to make a pickaxe.")
                this.engine.gotoScene(Table, "Crafting Table");
            }
        } else {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');