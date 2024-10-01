// List of resources a player owns
class Resources {
    constructor() {
        this.gold = 0;
        this.wood = 0;
        this.sheep = 0;
        this.stone = 0;
        this.clay = 0;
        this.hay = 0;
    }
}

// List of booleans - whether a player owns this type of harbour
class Harbours {
    constructor() {
        this.any = false;
        this.wood = false;
        this.sheep = false;
        this.stone = false;
        this.clay = false;
        this.hay = false;
    }
}

// Player information
class Player {
    constructor(name) {
        this.name = name;
        this.resources = new Resources();
        this.harbours = new Harbours();
    }
}

exports.Player = Player

// Settlement information
class Settlement {
    constructor(ID, player, resource, roll) {
        // Unique ID
        this.ID = ID;
        // Owning player
        this.player = player;
        // Associated resource
        this.resource = resource;
        // Triggering roll
        this.roll = roll;
        // Enabled (no Robber)
        this.enabled = true;
    }
}

exports.Settlement = Settlement