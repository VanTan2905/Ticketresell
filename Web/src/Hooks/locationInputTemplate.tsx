import React, { useEffect, useState, useCallback } from "react";

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

interface InputAddressFieldsProps {
  oldLocation: string | undefined;
  houseNumber: string;
  setHouseNumber: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors?: { [key: string]: string };
}

const InputAddressFields: React.FC<InputAddressFieldsProps> = ({
  oldLocation,
  houseNumber,
  setHouseNumber,
  setFormData,
  errors,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://api.npoint.io/ac646cb54b295b9555be"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/34608ea16bebc5cffd42"
      );
      const data: District[] = await response.json();
      const filteredDistricts = data.filter(
        (district) => district.ProvinceId === provinceId
      );
      setDistricts(filteredDistricts);
      return filteredDistricts;
    } catch (error) {
      console.error("Error fetching districts:", error);
      return [];
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/dd278dc276e65c68cdf5"
      );
      const data: Ward[] = await response.json();
      const filteredWards = data.filter(
        (ward) => ward.DistrictId === districtId
      );
      setWards(filteredWards);
      return filteredWards;
    } catch (error) {
      console.error("Error fetching wards:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    const initializeLocation = async () => {
      if (!oldLocation || provinces.length === 0) return;

      const parts = oldLocation.split(",").map((part) => part.trim());
      if (parts.length === 4) {
        const [houseNum, wardName, districtName, provinceName] = parts;

        setHouseNumber(houseNum);

        const province = provinces.find((p) => p.Name === provinceName);
        if (!province) return;

        setSelectedProvince(province.Id);

        const districtsData = await fetchDistricts(province.Id);
        const district = districtsData.find((d) => d.Name === districtName);
        if (!district) return;

        setSelectedDistrict(district.Id);

        const wardsData = await fetchWards(district.Id);
        const ward = wardsData.find((w) => w.Name === wardName);
        if (!ward) return;

        setSelectedWard(ward.Id);
      }
    };

    initializeLocation();
  }, [oldLocation, provinces]);

  const handleProvinceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedProvince(value ? Number(value) : null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
    },
    []
  );

  const handleDistrictChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedDistrict(value ? Number(value) : null);
      setSelectedWard(null);
      setWards([]);
    },
    []
  );

  const handleWardChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedWard(value ? Number(value) : null);
    },
    []
  );

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const updateFormData = () => {
      const provinceName =
        provinces.find((prov) => prov.Id === selectedProvince)?.Name || "";
      const districtName =
        districts.find((dist) => dist.Id === selectedDistrict)?.Name || "";
      const wardName = wards.find((wrd) => wrd.Id === selectedWard)?.Name || "";

      if (houseNumber && provinceName && districtName && wardName) {
        const fullAddress =
          `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
        setFormData((prevData: any) => ({
          ...prevData,
          address: fullAddress,
        }));
      }
    };

    updateFormData();
  }, [
    houseNumber,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
    setFormData,
  ]);

  const handleHouseNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHouseNumber(e.target.value);
    },
    [setHouseNumber]
  );

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="flex flex-col">
        <label
          htmlFor="houseNumber"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Số nhà/Đường
        </label>
        <input
          id="houseNumber"
          type="text"
          value={houseNumber}
          onChange={handleHouseNumberChange}
          className={`w-full px-3 py-2 bg-[#F5F7FC] border ${
            errors?.houseNumber ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
        {errors?.houseNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.houseNumber}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="province"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Tỉnh/Thành phố
        </label>
        <select
          id="province"
          value={selectedProvince || ""}
          onChange={handleProvinceChange}
          className={`w-full px-3 py-2 bg-[#F5F7FC] border ${
            errors?.province ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="">Chọn tỉnh/ Thành phố</option>
          {provinces.map((province) => (
            <option key={province.Id} value={province.Id}>
              {province.Name}
            </option>
          ))}
        </select>
        {errors?.province && (
          <p className="text-sm text-red-500 mt-1">{errors.province}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="district"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Huyện/Thị Xã
        </label>
        <select
          id="district"
          value={selectedDistrict || ""}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
          className={`w-full px-3 py-2 bg-[#F5F7FC] border ${
            errors?.district ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
        >
          <option value="">Chọn Huyện/Thị Xã</option>
          {districts.map((district) => (
            <option key={district.Id} value={district.Id}>
              {district.Name}
            </option>
          ))}
        </select>
        {errors?.district && (
          <p className="text-sm text-red-500 mt-1">{errors.district}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="ward"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Phường/Xã
        </label>
        <select
          id="ward"
          value={selectedWard || ""}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
          className={`w-full px-3 py-2 bg-[#F5F7FC] border ${
            errors?.ward ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.Id} value={ward.Id}>
              {ward.Name}
            </option>
          ))}
        </select>
        {errors?.ward && (
          <p className="text-sm text-red-500 mt-1">{errors.ward}</p>
        )}
      </div>
    </div>
  );
};

export default InputAddressFields;
