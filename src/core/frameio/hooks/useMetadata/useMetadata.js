import { useState } from 'react'; 

const mockData = {
  "d803343e-e862-4137-965b-bbaaac76aac5": {
    "field-1": "Reel 1",
    "field-2": "Cam A"
  },
  "e5d09326-69c6-495f-ba4d-d357ed0c7517": {
    "field-1": "Reel 1",
    "field-2": "Cam B"
  },
  "63196a76-6785-4286-a7c1-5221b69d2966": {
    "field-1": "Reel 2",
    "field-2": "Cam A"
  },
  "ee2ee46b-b438-4316-bd2f-0dd980fa5ae4": {
    "field-1": "Reel 2",
    "field-2": "Cam B"
  },
  "27a2bd33-6759-48a4-95dd-e913e5324398": {
    "field-1": "Reel 3",
    "field-2": "Cam A"
  },
  "1e27ac90-dc98-4ea9-8162-72920fc10a73": {
    "field-1": "Reel 3",
    "field-2": "Cam B"
  },
  "40ea9b60-02d4-4339-bfd1-56c7e6e7d69a": {
    "field-1": "Reel 4",
    "field-2": "Cam A"
  },
  "e5fb43c4-538e-4362-8f2c-f61ded446ec2": {
    "field-1": "Reel 4",
    "field-2": "Cam B"
  },
  "260f6b31-bc7b-4ad4-ac82-b39100d15ae4": {
    "field-1": "Reel 5",
    "field-2": "Cam C"
  },
  "8f6b4e6c-2409-4506-a5ae-d2480a66ae59": {
    "field-1": "Reel 5",
    "field-2": "Cam B"
  },
  "98235193-e64b-4b3c-9fbf-f35affaba1cd": {
    "field-1": "Reel 6",
    "field-2": "Cam C"
  },
  "c89b83fc-8a8b-4a97-a52b-489131a94fa4": {
    "field-1": "Reel 6",
    "field-2": "Cam B"
  },
}

const useMetadata = () => {

  const [state, setState] = useState(mockData);

  const getAsset = (asset) => {
    return { ...asset, ...state[asset.id] }
  }

  return {
    current: state,
    get: getAsset,
  }
}

export default useMetadata;