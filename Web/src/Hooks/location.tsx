import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';

type Province = {
  Id: number;
  Name: string;
};

type District = {
  Id: number;
  Name: string;
  ProvinceId: number;
};

type Ward = {
  Id: number;
  Name: string;
  DistrictId: number;
};

interface AddressFieldsProps {
  houseNumber: string;
  setHouseNumber: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ houseNumber, setHouseNumber, setFormData }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://api.npoint.io/ac646cb54b295b9555be");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch("https://api.npoint.io/34608ea16bebc5cffd42");
      const data: District[] = await response.json();
      const filteredDistricts = data.filter((district) => district.ProvinceId === provinceId);
      setDistricts(filteredDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch("https://api.npoint.io/dd278dc276e65c68cdf5");
      const data: Ward[] = await response.json();
      const filteredWards = data.filter((ward) => ward.DistrictId === districtId);
      setWards(filteredWards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    } else {
      setDistricts([]);
      setSelectedDistrict(null); // Reset district if province changes
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    } else {
      setWards([]);
      setSelectedWard(null); // Reset ward if district changes
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (selectedProvinceId: number | null) => {
    setSelectedProvince(selectedProvinceId);
  };

  const handleDistrictChange = (selectedDistrictId: number | null) => {
    setSelectedDistrict(selectedDistrictId);
  };

  const handleWardChange = (selectedWardId: number | null) => {
    setSelectedWard(selectedWardId);
  };

  const getFullAddress = () => {
    const provinceName = provinces.find(prov => prov.Id === selectedProvince)?.Name || '';
    const districtName = districts.find(dist => dist.Id === selectedDistrict)?.Name || '';
    const wardName = wards.find(wrd => wrd.Id === selectedWard)?.Name || '';

    return `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
  };

  useEffect(() => {
    if (houseNumber && selectedProvince && selectedDistrict && selectedWard) {
      setFormData(prevData => ({
        ...prevData,
        location: getFullAddress(),
      }));
    }
  }, [houseNumber, selectedProvince, selectedDistrict, selectedWard, setFormData]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <TextField
        className="bg-[#F5F7FC] w-full"
        label="Số nhà/Đường"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
        margin="normal"
        fullWidth
      />

      <Autocomplete
        options={provinces}
        getOptionLabel={(option: Province) => option.Name}
        value={provinces.find(province => province.Id === selectedProvince) || null}
        onChange={(event, newValue: Province | null) => {
          handleProvinceChange(newValue ? newValue.Id : null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className="bg-[#F5F7FC] w-full"
            label="Tỉnh/Thành phố"
            margin="normal"
            fullWidth
          />
        )}
      />

      <Autocomplete
        options={districts}
        getOptionLabel={(option: District) => option.Name}
        value={districts.find(district => district.Id === selectedDistrict) || null}
        onChange={(event, newValue: District | null) => {
          handleDistrictChange(newValue ? newValue.Id : null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className="bg-[#F5F7FC] w-full"
            label="Quận/Huyện"
            margin="normal"
            fullWidth
            disabled={!selectedProvince}
          />
        )}
      />

      <Autocomplete
        options={wards}
        getOptionLabel={(option: Ward) => option.Name}
        value={wards.find(ward => ward.Id === selectedWard) || null}
        onChange={(event, newValue: Ward | null) => {
          handleWardChange(newValue ? newValue.Id : null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className="bg-[#F5F7FC] w-full"
            label="Phường/Xã"
            margin="normal"
            fullWidth
            disabled={!selectedDistrict}
          />
        )}
      />
    </div>
  );
};

export default AddressFields;
