type ActionType = "go" | "take" | "use" | "read" | "search";
type ActionMap = { [key: string]: string };

interface LocationType {
    description: string;
    actions: { [key in ActionType]?: ActionMap };
}

class Game {
    private currentLocation: string;
    private inventory: string[];
    private locations: { [key: string]: LocationType };

    constructor() {
        this.currentLocation = "village";
        this.inventory = [];
        this.locations = {
            village: {
                description:
                    "You are in a quaint village surrounded by tall, ancient trees. Paths lead north to the forest and east to the lake. There is a small hut here.",
                actions: {
                    go: { north: "forest", east: "lake", enter: "hut" },
                },
            },
            hut: {
                description:
                    "You are inside a small, cozy hut. There is a table with a candle and a mysterious old book.",
                actions: {
                    read: {
                        book: "The book contains ancient scripts about a hidden treasure in the forest. It mentions a key hidden under a rock near the lake.",
                    },
                    go: { exit: "village" },
                },
            },
            forest: {
                description:
                    "You are in a dark forest. The trees are dense, and it's eerily quiet. Paths lead south back to the village and deeper into the forest to the north.",
                actions: {
                    go: { south: "village", north: "deep_forest" },
                },
            },
            deep_forest: {
                description:
                    "You have ventured deeper into the forest. You hear faint sounds of running water to the west. To the east, there seems to be a clearing.",
                actions: {
                    go: { south: "forest", west: "river", east: "clearing" },
                },
            },
            river: {
                description:
                    "You are by a fast-flowing river. On the ground, you notice a glint of something shiny.",
                actions: {
                    take: { key: "You take the shiny key from the ground." },
                    go: { east: "deep_forest" },
                },
            },
            clearing: {
                description:
                    "You are in a sunny clearing. There is an old, locked chest here.",
                actions: {
                    use: {
                        key: "You use the key to open the chest and find a treasure inside! Congratulations, you have won the game!",
                    },
                    go: { west: "deep_forest" },
                },
            },
            lake: {
                description:
                    "You are at the edge of a beautiful lake. The water is calm and clear. Paths lead west back to the village and north to a small island.",
                actions: {
                    go: { west: "village", north: "island" },
                    search: {
                        rock: "You find a key hidden under a rock near the lake.",
                    },
                },
            },
            island: {
                description:
                    "You are on a small island in the middle of the lake. There is an ancient tree here with something carved into its trunk.",
                actions: {
                    read: {
                        carving:
                            "The carving is a map that points to a hidden treasure in the forest clearing.",
                    },
                    go: { south: "lake" },
                },
            },
        };
    }
    // constructor ends

    public init(): void {
        const gameInput = document.querySelector(
            "#game-input"
        ) as HTMLInputElement;

        const submitBtn = document.querySelector(
            "#submit-btn"
        ) as HTMLButtonElement;

        gameInput.addEventListener("keypress", (e: KeyboardEvent): void => {
            if (e.key === "Enter") {
                submitBtn.click();
            }
        });

        submitBtn.addEventListener("click", (): void => {
            const command: string = gameInput.value.trim();
            if (command) {
                this.handleCommand(command);
                gameInput.value = "";
            }
        });
        this.outputText(this.locations[this.currentLocation].description);
    }
    // init ends

    private outputText(text: string): void {
        const p: HTMLParagraphElement = document.createElement("p");
        p.textContent = text;
        const gameOutput = document.querySelector(
            "#game-output"
        ) as HTMLDivElement;
        gameOutput.append(p);
        gameOutput.scrollTop = gameOutput.scrollHeight;
    }
    // outputText ends

    private handleCommand(command: string): void {
        const [action, ...args] = command.split(" ");
        const arg = args.join(" ");
        const location: LocationType = this.locations[this.currentLocation];
        if (action in location.actions) {
            const actionMap = location.actions[action as ActionType]!;
            if (arg in actionMap) {
                if (action === "go") {
                    this.currentLocation = actionMap[arg];
                    this.outputText(
                        this.locations[this.currentLocation].description
                    );
                } else if (action === "take") {
                    this.inventory.push("arg");
                    this.outputText(actionMap[arg]);
                } else if (action === "use") {
                    if (this.inventory.includes(arg)) {
                        this.outputText(actionMap[arg]);
                    } else {
                        this.outputText("You Don't Have That Item.");
                    }
                } else {
                    this.outputText(actionMap[arg]);
                }
            } else {
                this.outputText("You Can't Do That.");
            }
        } else {
            this.outputText("Unknown Command.");
        }
    }
    // handleCommand ends
}

const game = new Game();
game.init();
