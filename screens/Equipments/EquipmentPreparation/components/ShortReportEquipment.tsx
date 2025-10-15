import { useEffect, useState } from "react";
import { View, Text, I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import { icons } from "../../../../constants";
import styles from "../styles";
import MainTextInput from "../../../common/components/MainTextInput";

type Equipment = {
  id: number;
  name: string;
  number: number;
  brand?: string;
  dateOnly?: string;
  status?: number | null;
  attendanceStatusId?: number | null;
  image?: string;
};

type EquipmentCounts = {
  active: number;
  inactive: number;
  withPermission: number;
  pending: number;
};

type ShortReportEquipmentProps = {
  data: Equipment[];
  searchResult?: (filtered: Equipment[]) => void;
  setEquipmentStatus?: React.Dispatch<React.SetStateAction<string>>;
};

const ShortReportEquipment = ({ data, searchResult }: ShortReportEquipmentProps) => {
  const { t } = useTranslation();
  const [equipmentCounts, setEquipmentCounts] = useState<EquipmentCounts>({
    active: 0,
    inactive: 0,
    withPermission: 0,
    pending: 0,
  });

  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEquipments(data);
      searchResult?.(data);
    } else {
      const normalizedSearchTerm = searchTerm.toLowerCase();

      const filteredList = data.filter((equip) => {
        const isNumericSearch = !isNaN(Number(searchTerm));

        return isNumericSearch
          ? String(equip.id) === searchTerm
          : equip.name?.toLowerCase().includes(normalizedSearchTerm);
      });

      setFilteredEquipments(filteredList);
      searchResult?.(filteredList);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    calculateEquipmentCounts();
  }, [data]);

  const calculateEquipmentCounts = () => {
    let active = 0;
    let inactive = 0;
    let withPermission = 0;
    let pending = 0;

    data.forEach((equip) => {
      switch (equip.status) {
        case 1:
          active++;
          break;
        case 2:
          inactive++;
          break;
        case 3:
          withPermission++;
          break;
        case null:
        case undefined:
          pending++;
          break;
        default:
          pending++;
          break;
      }
    });

    setEquipmentCounts({
      active,
      inactive,
      withPermission,
      pending,
    });
  };

  const ReportRow = ({ label, data }: { label: string; data: number }) => {
    return (
      <Text style={styles.labeltxt}>
        {label}: <Text style={styles.numtxt}>{data}</Text>
      </Text>
    );
  };

  return (
    <View style={styles.paddingWhiteView}>
      <View style={styles.row}>
        <ReportRow label={t("number_of_equipments")} data={data.length} />
        <ReportRow label={t("active")} data={equipmentCounts.active} />
        <ReportRow label={t("inactive")} data={equipmentCounts.inactive} />
        <ReportRow label={t("with_permission")} data={equipmentCounts.withPermission} />
        <ReportRow label={t("pending")} data={equipmentCounts.pending} />
      </View>

      <MainTextInput
        onChangeText={(val: string) => setSearchTerm(val)}
        placeholder={t("equipmentSearch")}
        leftIcon={icons.search}
        leftIconAction={() => {}}
        rightIconAction={() => {
          setSearchTerm("");
          searchResult?.(data);
        }}
        rightIcon={icons.clear}
        value={searchTerm}
      />
    </View>
  );
};

export default ShortReportEquipment;
