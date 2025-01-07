type Specs = {
  type?: "bullet" | "weapon" | "Weapon Mods" | "Tactical";
  weight?: number;
  space?: number;
  description?: string;
}

interface Item {
  name: string;
  specs: Specs;
  drop: () => void;
}

// creational pattern. 
// i want attachments: {name: string, properties: []}; to be {Attachments}

class Weapon implements Item {
    public attachments: Map<string, Attachment> = new Map(); 

    constructor(
        public name: string,
        public specs: Specs,
    ) {};
    

    public drop() {
        console.log("weapon is dropped")
        return null
    }

    public add_attachment(att: Attachment) {
        if(!this.attachments.has(att.name)) {
            this.attachments.set(att.name, att)
        } else {
            console.log("This attachment is already on the Weapon")
        }
        return this
    }
    public remove_attachment (att: Attachment) {
        if(this.attachments.has(att.name)){
            this.attachments.delete(att.name)
        }
        return this
    }

    public build (list: Attachment[]) {
        for(const att of list) {
            this.add_attachment(att)
        }
        return this
    }
    private aplifier() {
        
    }
}

class Attachment implements Item {
    constructor(
        public name: string,
        public specs: Specs
    ) {};


    public drop() {
        console.log("Attachment is dropped")
        return null
    }

}

