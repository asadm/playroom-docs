import pathfinding from "pathfinding";

const items = {
  washer: {
    name: "washer",
    size: [2, 2],
  },
  toiletSquare: {
    name: "toiletSquare",
    size: [2, 2],
  },
  trashcan: {
    name: "trashcan",
    size: [1, 1],
  },
  bathroomCabinetDrawer: {
    name: "bathroomCabinetDrawer",
    size: [2, 2],
  },
  bathtub: {
    name: "bathtub",
    size: [4, 2],
  },
  bathroomMirror: {
    name: "bathroomMirror",
    size: [2, 1],
    wall: true,
  },
  bathroomCabinet: {
    name: "bathroomCabinet",
    size: [2, 1],
    wall: true,
  },
  bathroomSink: {
    name: "bathroomSink",
    size: [2, 2],
  },
  showerRound: {
    name: "showerRound",
    size: [2, 2],
  },
  tableCoffee: {
    name: "tableCoffee",
    size: [4, 2],
  },
  loungeSofaCorner: {
    name: "loungeSofaCorner",
    size: [5, 5],
  },
  bear: {
    name: "bear",
    size: [2, 1],
    wall: true,
  },
  loungeSofaOttoman: {
    name: "loungeSofaOttoman",
    size: [2, 2],
  },
  tableCoffeeGlassSquare: {
    name: "tableCoffeeGlassSquare",
    size: [2, 2],
  },
  loungeDesignSofaCorner: {
    name: "loungeDesignSofaCorner",
    size: [5, 5],
  },
  loungeDesignSofa: {
    name: "loungeDesignSofa",
    size: [5, 2],
  },
  loungeSofa: {
    name: "loungeSofa",
    size: [5, 2],
  },
  bookcaseOpenLow: {
    name: "bookcaseOpenLow",
    size: [2, 1],
  },
  kitchenBar: {
    name: "kitchenBar",
    size: [2, 1],
  },
  bookcaseClosedWide: {
    name: "bookcaseClosedWide",
    size: [3, 1],
  },
  bedSingle: {
    name: "bedSingle",
    size: [3, 5],
  },
  bench: {
    name: "bench",
    size: [2, 1],
  },
  bedDouble: {
    name: "bedDouble",
    size: [5, 5],
  },
  benchCushionLow: {
    name: "benchCushionLow",
    size: [2, 1],
  },
  loungeChair: {
    name: "loungeChair",
    size: [2, 2],
  },
  cabinetBedDrawer: {
    name: "cabinetBedDrawer",
    size: [1, 1],
  },
  cabinetBedDrawerTable: {
    name: "cabinetBedDrawerTable",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [4, 2],
  },
  tableCrossCloth: {
    name: "tableCrossCloth",
    size: [4, 2],
  },
  plant: {
    name: "plant",
    size: [1, 1],
  },
  plantSmall: {
    name: "plantSmall",
    size: [1, 1],
  },
  rugRounded: {
    name: "rugRounded",
    size: [6, 4],
    walkable: true,
  },
  rugRound: {
    name: "rugRound",
    size: [4, 4],
    walkable: true,
  },
  rugSquare: {
    name: "rugSquare",
    size: [4, 4],
    walkable: true,
  },
  rugRectangle: {
    name: "rugRectangle",
    size: [8, 4],
    walkable: true,
  },
  televisionVintage: {
    name: "televisionVintage",
    size: [4, 2],
  },
  televisionModern: {
    name: "televisionModern",
    size: [4, 2],
  },
  kitchenCabinetCornerRound: {
    name: "kitchenCabinetCornerRound",
    size: [2, 2],
  },
  kitchenCabinetCornerInner: {
    name: "kitchenCabinetCornerInner",
    size: [2, 2],
  },
  kitchenCabinet: {
    name: "kitchenCabinet",
    size: [2, 2],
  },
  kitchenBlender: {
    name: "kitchenBlender",
    size: [1, 1],
  },
  dryer: {
    name: "dryer",
    size: [2, 2],
  },
  chairCushion: {
    name: "chairCushion",
    size: [1, 1],
  },
  chair: {
    name: "chair",
    size: [1, 1],
  },
  deskComputer: {
    name: "deskComputer",
    size: [3, 2],
  },
  desk: {
    name: "desk",
    size: [3, 2],
  },
  chairModernCushion: {
    name: "chairModernCushion",
    size: [1, 1],
  },
  chairModernFrameCushion: {
    name: "chairModernFrameCushion",
    size: [1, 1],
  },
  kitchenMicrowave: {
    name: "kitchenMicrowave",
    size: [1, 1],
  },
  coatRackStanding: {
    name: "coatRackStanding",
    size: [1, 1],
  },
  kitchenSink: {
    name: "kitchenSink",
    size: [2, 2],
  },
  lampRoundFloor: {
    name: "lampRoundFloor",
    size: [1, 1],
  },
  lampRoundTable: {
    name: "lampRoundTable",
    size: [1, 1],
  },
  lampSquareFloor: {
    name: "lampSquareFloor",
    size: [1, 1],
  },
  lampSquareTable: {
    name: "lampSquareTable",
    size: [1, 1],
  },
  toaster: {
    name: "toaster",
    size: [1, 1],
  },
  kitchenStove: {
    name: "kitchenStove",
    size: [2, 2],
  },
  laptop: {
    name: "laptop",
    size: [1, 1],
  },
  radio: {
    name: "radio",
    size: [1, 1],
  },
  speaker: {
    name: "speaker",
    size: [1, 1],
  },
  speakerSmall: {
    name: "speakerSmall",
    size: [1, 1],
  },
  stoolBar: {
    name: "stoolBar",
    size: [1, 1],
  },
  stoolBarSquare: {
    name: "stoolBarSquare",
    size: [1, 1],
  },
};

const map = {
  size: [10, 10],
  gridDivision: 2,
  items: [
    {
      ...items.showerRound,
      gridPosition: [0, 0],
    },
    {
      ...items.toiletSquare,
      gridPosition: [0, 3],
      rotation: 1,
    },
    {
      ...items.washer,
      gridPosition: [5, 0],
    },
    {
      ...items.bathroomSink,
      gridPosition: [7, 0],
    },
    {
      ...items.trashcan,
      gridPosition: [0, 5],
      rotation: 1,
    },
    {
      ...items.bathroomCabinetDrawer,
      gridPosition: [3, 0],
    },
    {
      ...items.bathtub,
      gridPosition: [4, 4],
    },
    {
      ...items.bathtub,
      gridPosition: [0, 8],
      rotation: 3,
    },
    {
      ...items.bathroomCabinet,
      gridPosition: [3, 0],
    },
    {
      ...items.bathroomMirror,
      gridPosition: [0, 8],
      rotation: 1,
    },
    {
      ...items.bathroomMirror,
      gridPosition: [, 10],
      rotation: 1,
    },
    {
      ...items.tableCoffee,
      gridPosition: [10, 8],
    },
    {
      ...items.rugRectangle,
      gridPosition: [8, 7],
    },
    {
      ...items.loungeSofaCorner,
      gridPosition: [6, 10],
    },
    {
      ...items.bear,
      gridPosition: [0, 3],
      rotation: 1,
    },
    {
      ...items.plant,
      gridPosition: [11, 13],
    },
    {
      ...items.cabinetBedDrawerTable,
      gridPosition: [13, 19],
    },
    {
      ...items.cabinetBedDrawer,
      gridPosition: [19, 19],
    },
    {
      ...items.bedDouble,
      gridPosition: [14, 15],
    },
    {
      ...items.bookcaseClosedWide,
      gridPosition: [12, 0],
      rotation: 2,
    },
    {
      ...items.speaker,
      gridPosition: [11, 0],
    },
    {
      ...items.speakerSmall,
      gridPosition: [15, 0],
    },
    {
      ...items.loungeChair,
      gridPosition: [10, 4],
    },
    {
      ...items.loungeSofaOttoman,
      gridPosition: [14, 4],
    },
    {
      ...items.loungeDesignSofa,
      gridPosition: [18, 0],
      rotation: 1,
    },
    {
      ...items.kitchenCabinetCornerRound,
      gridPosition: [2, 18],
      rotation: 2,
    },
    {
      ...items.kitchenCabinetCornerInner,
      gridPosition: [0, 18],
      rotation: 2,
    },
    {
      ...items.kitchenStove,
      gridPosition: [0, 16],
      rotation: 1,
    },
    {
      ...items.dryer,
      gridPosition: [0, 14],
      rotation: 1,
    },
    {
      ...items.lampRoundFloor,
      gridPosition: [0, 12],
    },
  ],
};

const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

const updateGrid = () => {
  // RESET
  for (let x = 0; x < map.size[0] * map.gridDivision; x++) {
    for (let y = 0; y < map.size[1] * map.gridDivision; y++) {
      grid.setWalkableAt(x, y, true);
    }
  }

  map.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid.setWalkableAt(
          item.gridPosition[0] + x,
          item.gridPosition[1] + y,
          false
        );
      }
    }
  });
};

updateGrid();

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export {
  map,
  grid,
  findPath,
  generateRandomPosition,
  generateRandomHexColor,
}