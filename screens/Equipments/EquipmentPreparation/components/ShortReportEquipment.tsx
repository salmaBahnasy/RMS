import { useEffect, useState } from "react";
import { View, Text, I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import { icons } from "../../../../constants";
import styles from "../styles";
import MainTextInput from "../../../common/components/MainTextInput";

type Equipment = {
  equipmentId: string;
  equipmentName: string;
  equipmentNameEn: string;
  status?: number | null; // الحالات: 1 نشط، 2 معطل، 3 بإذن، null لم تُسجل بعد
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
    } else {
      const filteredList = data.filter((equip) => {
        const isNumericSearch = !isNaN(Number(searchTerm));
        const EquipName = I18nManager?.isRTL ? equip.equipmentName : equip.equipmentNameEn;
        const normalizedSearchTerm = searchTerm.toLowerCase();

        return isNumericSearch
          ? String(equip.equipmentId) === searchTerm
          : EquipName?.toLowerCase().includes(normalizedSearchTerm);
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
      <Text style={{ ...styles.labeltxt }}>
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
        onChangeText={(val: string) => {
          setSearchTerm(val);
        }}
        placeholder={t("equipmentSearch")}
        leftIcon={icons.search}
        leftIconAction={() => {}}
        rightIconAction={() => {
          setSearchTerm("");
          searchResult?.([]);
        }}
        rightIcon={icons.clear}
        value={searchTerm}
      />
    </View>
  );
};

export default ShortReportEquipment;
