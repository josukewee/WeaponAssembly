import * as THREE from 'three'

type WeaponPartCategory =
  | "Trigger Assembly/Fire Control Group"
  | "Front Sight"
  | "Rear Sight"
  | "Scope"
  | "Front Grip Rail"
  | "Handguard"
  | "Barrel"
  | "Muzzle"
  | "Dust Cover"
  | "Magazine"
  | "Weapon"
  | "Bolt Carrier Group"
  | "Dust Cover Rail"
  | "Tactical Rail"
  | "Muzzle Device"
  | "Stock"
  | "Grip"
  | "Frame"
  | "Charging Handle"
  | "Internal"
  | "Forward Assist"
  | "Upper Receiver"
  | "Lower Receiver";

  
  type Specs = {
    type: WeaponPartCategory;
    weight?: number;
    space?: number;
    description?: string;
  };
  
  interface Item {
    get Stats(): WeaponStats;
    get Type(): Specs["type"];
  get Name(): string;
  specs: Specs;
  drop: () => void;
}

// creational pattern.
// i want attachments: {name: string, properties: []}; to be {Attachments}

// Интерфейс для характеристик оружия
interface WeaponStats {
  damage: number;
  accuracy: number;
  verticalRecoil: number;
  horizontalRecoil: number;
  ergonomics: number;
}

type AttachmentSlots = Partial<Record<WeaponPartCategory, number>>;
// Базовый интерфейс для всех компонентов

class Weapon implements Item {
  private components: AttachmentNode[];
  private initialStats: WeaponStats;

  constructor(
    public root: AttachmentNode,
    private name: string,
    public specs: Specs
  ) {
    this.components = [root];
    const rootStats = root.Stats;
    this.initialStats = { ...rootStats };
  }

  // need to handle the situation where the couple attachments are passed(will it already have right structure?)
  public add_attachment(att: AttachmentNode): Weapon {
    if (this.components.length === 0) {
      this.root = att;
      return this;
    }

    const compatibleSlots = this.components.filter(
      (component) =>
        component.compatibleAttachments[att.Type] &&
        component.compatibleAttachments[att.Type]! > 0
    );

    const chosenSlot = this.selectSlot(compatibleSlots, att)
    if(chosenSlot) {
        chosenSlot.addChild(att);
        this.amplifier(att, true);
    } else {
        console.log(`${att.name} cannot be added to ${this.name}: No slots were found`)
    }
    return this;
    }

   private selectSlot(compatibleSlots: AttachmentNode[], att: AttachmentNode): AttachmentNode | null {
    // this method returns the attachment to which we should add another, which is given\
    // for the sake of simplicity adding to the very first filltered attachment
    return compatibleSlots.length > 0 ? compatibleSlots[0] : null;
    }

  public remove_attachment(att: AttachmentNode): Weapon {
    // Проверяем, является ли компонент корневым
    if (att === this.components[0]) {
      console.log("Root component cannot be deleted");
      return this;
    }

    const componentToRemove = this.components.find((c) => c === att);
    if (!componentToRemove) {
      console.log(`${att.Name} were not found on the ${this.name}`);
      return this;
    }

    const parent = componentToRemove.Parent;
    if (!parent) {
      console.log(`${att.Name} не имеет родительского компонента`);
      return this;
    }

    // Удаляем компонент и все его дочерние элементы
    if (parent.removeChild(componentToRemove)) {
      // Получаем все дочерние компоненты рекурсивно
      const getAllChildren = (node: AttachmentNode): AttachmentNode[] => {
        return [
          node,
          ...node.Children.flatMap((child) => getAllChildren(child)),
        ];
      };

      const removedNodes = getAllChildren(componentToRemove);
      removedNodes.forEach((node) => this.amplifier(node, false));
      this.components = this.components.filter(
        (c) => !removedNodes.includes(c as AttachmentNode)
      );

      console.log(`${att.Name} и все его модификации успешно удалены`);
    }

    return this;
  }

  private amplifier(att: AttachmentNode, isAdding: boolean): void {
    const stats = att.Stats;
    const multiplier = isAdding ? 1 : -1;
    Object.keys(stats).forEach((key) => {
      this.initialStats[key as keyof WeaponStats] +=
        stats[key as keyof WeaponStats] * multiplier;
    });

    // Исправляем вывод статов
    console.log("Stats updated:", {
      damage: this.initialStats.damage,
      accuracy: this.initialStats.accuracy,
      verticalRecoil: this.initialStats.verticalRecoil,
      horizontalRecoil: this.initialStats.horizontalRecoil,
      ergonomics: this.initialStats.ergonomics,
    });
  }

  public get Stats(): WeaponStats {
    return this.initialStats;
  }


  public get Components(): AttachmentNode[] {
    return this.components;
  }

  public drop() {
    console.log("weapon is dropped");
    return null;
  }

  public get Name(): string {
    return this.name;
  }
  public get Type(): Specs["type"] {
    return this.specs.type;
  }

  public findNode(id: string): AttachmentNode | null {
    return this.components[0].findAttachment((node) => node.Name === id);
  }

  // Добавим метод для красивого вывода статов
  public printStats(): void {
    console.log("Current Weapon Stats:");
    console.log("- Damage:", this.initialStats.damage);
    console.log("- Accuracy:", this.initialStats.accuracy);
    console.log("- Vertical Recoil:", this.initialStats.verticalRecoil);
    console.log("- Horizontal Recoil:", this.initialStats.horizontalRecoil);
    console.log("- Ergonomics:", this.initialStats.ergonomics);
  }
}

class AttachmentNode implements Item {
  // private children array forces all changes to go through certain methods
  private stats: WeaponStats;
  private children: AttachmentNode[] = [];
  private parent: AttachmentNode | null;

  constructor(
    public readonly name: string,
    public modelPath: string,
    public readonly specs: Specs,
    public compatibleAttachments: AttachmentSlots,
    parent: AttachmentNode | null,
    stats: WeaponStats
  ) {
    this.stats = stats;
    this.parent = parent;
  }

  public get Children(): AttachmentNode[] {
    return this.children;
  }

  public get Parent(): AttachmentNode | null {
    return this.parent ? this.parent : null;
  }

  public get Stats(): WeaponStats {
    // Комбинируем статы текущего компонента и всех дочерних
    let totalStats = { ...this.stats };

    this.children.forEach((child) => {
      const childStats = child.Stats;
      totalStats.damage += childStats.damage;
      totalStats.accuracy += childStats.accuracy;
      totalStats.verticalRecoil += childStats.verticalRecoil;
      totalStats.horizontalRecoil += childStats.horizontalRecoil;
      totalStats.ergonomics += childStats.ergonomics;
    });

    return totalStats;
  }

  public get Name(): string {
    return this.name;
  }

  public get Type(): Specs["type"] {
    return this.specs.type;
  }

  public listChildrenXML(): string {
    const getChildrenNames = (
      node: AttachmentNode,
      depth: number = 0
    ): string => {
      const indent = "    ".repeat(depth);
      const childNames = node.children.map((child) => {
        const childStr = `${indent}<attachment name="${child.name}" type="${child.specs.type}">`;
        const childrenStr = getChildrenNames(child, depth + 1);
        const closingTag = childrenStr
          ? `\n${indent}</attachment>`
          : `</attachment>`;
        return `\n${childStr}${childrenStr}${closingTag}`;
      });
      return childNames.join("");
    };
    return `<attachments>\n    <attachment name="${this.name}" type="${
      this.specs.type
    }">${getChildrenNames(this, 2)}\n    </attachment>\n</attachments>`;
  }

  public canAttach(child: AttachmentNode): boolean {
    return (
      child.specs.type in this.compatibleAttachments &&
      (this.compatibleAttachments[child.specs.type] ?? 0) > 0
    );
  }

  public addChild(child: AttachmentNode): boolean {
    if ((this.compatibleAttachments[child.specs.type] ?? 0) <= 0) {
      console.log(
        `${child.name} cannot be attached to ${this.name} because there are no compatible slots`
      );
      return false;
    }

    child.parent = this;
    this.children = [...this.children, child];
    this.compatibleAttachments[child.specs.type] =
      (this.compatibleAttachments[child.specs.type] ?? 0) - 1;
    console.log(`${child.name} was successfully attached to ${this.name}`);
    return true;
  }

  public removeChild(child: AttachmentNode): boolean {
    const childIndex = this.children.findIndex((node) => node === child);

    if (childIndex === -1) {
      console.log("Child is not found in the object");
      return false;
    }

    const removeDescendants = (node: AttachmentNode): void => {
      node.children.forEach((descendant) => removeDescendants(descendant));
      node.children = [];
    };

    removeDescendants(child);
    this.compatibleAttachments[child.specs.type] =
      (this.compatibleAttachments[child.specs.type] ?? 0) + 1;
    this.children.splice(childIndex, 1);
    console.log(`${child.name} and its descendants were removed successfully`);
    return true;
  }

  public drop() {
    console.log("Attachment is dropped");
    return null;
  }

  public findAttachment(
    predicate: (node: AttachmentNode) => boolean
  ): AttachmentNode | null {
    if (predicate(this)) {
      return this;
    }

    for (const child of this.children) {
      const found = child.findAttachment(predicate);
      if (found) {
        return found;
      }
    }

    return null;
  }

  public findAllAttachments(
    predicate: (node: AttachmentNode) => boolean
  ): AttachmentNode[] {
    const results: AttachmentNode[] = [];

    // Проверяем текущий узел
    if (predicate(this)) {
      results.push(this);
    }

    // Рекурсивно проверяем дочерние узлы
    this.children.forEach((child) => {
      results.push(...child.findAllAttachments(predicate));
    });

    return results;
  }
}

// Общие типы для всех видов оружия


// Абстрактная фабрика оружия
// abstract class WeaponFactory {
//   protected abstract readonly weaponName: string;
//   protected abstract readonly weaponDescription: string;

//   // Абстрактные методы для создания компонентов
//   protected abstract createUpperReceiver(): AttachmentNode;
//   protected abstract createLowerReceiver(): AttachmentNode;
//   protected abstract createBarrel(): AttachmentNode;
//   protected abstract createInternalParts(): AttachmentNode[]; // BCG, Charging Handle
//   protected abstract createExternalParts(): AttachmentNode[]; // Handguard, Sights, etc.

//   // Базовый метод для создания компонента
//   protected createComponent(
//     name: string,
//     modelPath: string,
//     parent: AttachmentNode | null,
//     stats: WeaponStats,
//     specs: Specs,
//     compatibleAttachments: AttachmentSlots
//   ): AttachmentNode {
//     return new AttachmentNode(
//       name,
//       modelPath,
//       specs,
//       compatibleAttachments,
//       parent,
//       stats
//     );
//   }

//   // Основной метод для создания оружия
//   public createWeapon(): Weapon {
//     const upperReceiver = this.createUpperReceiver();
//     const lowerReceiver = this.createLowerReceiver();
//     const barrel = this.createBarrel();
//     const internalParts = this.createInternalParts();
//     const externalParts = this.createExternalParts();

//     // Создаем оружие с upper receiver как корнем
//     const weapon = new Weapon(upperReceiver, this.weaponName, {
//       type: "Weapon",
//       description: this.weaponDescription,
//     });

//     // Собираем структуру
//     upperReceiver.addChild(lowerReceiver);
//     upperReceiver.addChild(barrel);
//     internalParts.forEach((part) => upperReceiver.addChild(part));

    // Обновляем компоненты
   
//     return weapon;
//   }

//   private getAllComponents(node: AttachmentNode): AttachmentNode[] {
//     return [
//       node,
//       ...node.Children.flatMap((child) => this.getAllComponents(child)),
//     ];
//   }
// }

// // Пример реализации для AR-15
// class AR15Factory extends WeaponFactory {
//   protected readonly weaponName = "AR-15";
//   protected readonly weaponDescription = "Modern sporting rifle platform";

//   protected createUpperReceiver(): AttachmentNode {
//     // Upper receiver - основной компонент
//     return this.createComponent(
//       "AR-15 Upper Receiver",
//       "Upper Receiver",
//       "Standard AR-15 upper receiver",
//       {
//         "Bolt Carrier Group": 1,
//         "Charging Handle": 1,
//         "Dust Cover": 1,
//         "Dust Cover Rail": 1,
//         "Forward Assist": 1,
//         Barrel: 1,
//         "Lower Receiver": 1,
//       },
//       {
//         damage: 0,
//         accuracy: 2,
//         verticalRecoil: 15,
//         horizontalRecoil: 18,
//         ergonomics: -2,
//       }
//     );
//   }

//   protected createLowerReceiver(): AttachmentNode {
//     // Lower receiver с его слотами
//     return this.createComponent(
//       "AR-15 Lower Receiver",
//       "Lower Receiver",
//       "Standard lower receiver",
//       {
//         "Bolt Carrier Group": 1,
//         Stock: 1,
//         Grip: 1,
//         Magazine: 1,
//         "Trigger Assembly/Fire Control Group": 1,
//       },
//       {
//         damage: 0,
//         accuracy: 0,
//         verticalRecoil: 0,
//         horizontalRecoil: 0,
//         ergonomics: 0,
//       }
//     );
//   }

//   protected createBarrel(): AttachmentNode {
//     // Внешние компоненты
//     return this.createComponent(
//       '16" Barrel',
//       "Barrel",
//       "Standard barrel",
//       {
//         Handguard: 1,
//         "Muzzle Device": 1,
//         "Front Sight": 1,
//       },
//       {
//         damage: 50,
//         accuracy: 15,
//         verticalRecoil: 10,
//         horizontalRecoil: 8,
//         ergonomics: -5,
//       }
//     );
//   }

//   protected createInternalParts(): AttachmentNode[] {
//     // Внутренние компоненты
//     const bcg = this.createComponent(
//       "Bolt Carrier Group",
//       "Bolt Carrier Group",
//       "Standard BCG",
//       {},
//       {
//         damage: 0,
//         accuracy: 2,
//         verticalRecoil: 5,
//         horizontalRecoil: 3,
//         ergonomics: 0,
//       }
//     );

//     const chargingHandle = this.createComponent(
//       "Charging Handle",
//       "Charging Handle",
//       "Standard charging handle",
//       {},
//       {
//         damage: 0,
//         accuracy: 0,
//         verticalRecoil: 0,
//         horizontalRecoil: 0,
//         ergonomics: 1,
//       }
//     );

//     return [bcg, chargingHandle];
//   }

//   protected createExternalParts(): AttachmentNode[] {
//     // Внешние компоненты
//     const handguard = this.createComponent(
//       "M-LOK Handguard",
//       "Handguard",
//       "Standard handguard",
//       {
//         "Tactical Rail": 4,
//         "Front Grip Rail": 2,
//       },
//       {
//         damage: 0,
//         accuracy: 2,
//         verticalRecoil: -2,
//         horizontalRecoil: -2,
//         ergonomics: -2,
//       }
//     );

//     return [handguard];
//   }
// }

// // ar 15. the root is lower receiver. there are two essential parts: upper receiver and lower receiver.
// // the upper receiver has: bolt carrier group, charging handle, dustcover rail, handguard, barrel, muzzle device, tactical rail, scope.
// // the frame has two essential parts: stock and grip.
// // the grip has two essential parts: handguard and front sight.
// // the handguard has two essential parts: muzzle device and tactical rails.

// // Использование:
// const ar15Factory = new AR15Factory();
// const ar15 = ar15Factory.createWeapon();
// console.log(ar15.root.listChildrenXML());
// ar15.printStats(); // Добавляем вывод финальных статов

export { Weapon, AttachmentNode, WeaponStats, Specs };
