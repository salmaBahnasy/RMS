import { useEffect, useState } from "react";
import { View, Text, I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import { icons } from "../../../../constants";
import styles from "../styles";
import MainTextInput from "../../../common/components/MainTextInput";

type Employee = {
  // AttendanceStatus: number | null;
  employeeId: string;
  name?: string;
  employeeName: string;
  employeeNameEn: string;
  status?: number;
  image?: string;
};

type AttendanceCounts = {
  attended: number;
  absence: number;
  absentWithPermission: number;
  noStatus: number;
};

type ShortReportProps = {
  data: Employee[];
  searchResult: (filtered: Employee[]) => void;
  setemployStatues: React.Dispatch<React.SetStateAction<string>>; // أضف هذا السطر

};

const ShortReport = ({ data, searchResult }: ShortReportProps) => {
  const { t } = useTranslation();
  const [attendanceCounts, setAttendanceCounts] = useState<AttendanceCounts>({
    attended: 0,
    absence: 0,
    absentWithPermission: 0,
    noStatus: 0,
  });

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEmployees(data);
    } else {
      const filteredList = data.filter((employee) => {
        const isNumericSearch = !isNaN(Number(searchTerm));
        const WorkerName = I18nManager?.isRTL ? employee?.employeeName : employee?.employeeNameEn;
        const normalizedSearchTerm = searchTerm.toLowerCase();

        return isNumericSearch
          ? String(employee.employeeId) === searchTerm
          : WorkerName?.toLowerCase().includes(normalizedSearchTerm);

      });

      setFilteredEmployees(filteredList);
      searchResult(filteredList);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    calculateAttendanceCounts();
  }, [data]);

  const calculateAttendanceCounts = () => {
    let attended = 0;
    let absence = 0;
    let absentWithPermission = 0;
    let noStatus = 0;

    data.forEach((employee) => {
      switch (employee.status) {
        case 1:
          attended++;
          break;
        case 2:
          absence++;
          break;
        case 3:
          absentWithPermission++;
          break;
        case 4:
          absence++;
          break;
        case null:
          absence++;
          break;
        default:
          noStatus++;
          break;
      }
    });

    setAttendanceCounts({
      attended,
      absence,
      absentWithPermission,
      noStatus,
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
        <ReportRow label={t("number_of_workers")} data={data.length} />
        <ReportRow label={t("attendance")} data={attendanceCounts.attended} />
        <ReportRow label={t("absence")} data={attendanceCounts.absence} />
        <ReportRow
          label={t("absent_with_permission")}
          data={attendanceCounts.absentWithPermission}
        />
      </View>
      <MainTextInput
        onChangeText={(val: string) => {
          setSearchTerm(val);
        }}
        placeholder={t("employeeSearch")}
        leftIcon={icons.search}
        leftIconAction={() => { }}
        rightIconAction={() => {
          setSearchTerm("");
          searchResult([]);
        }}
        rightIcon={icons.clear}
        value={searchTerm}
      />
    </View>
  );
};

export default ShortReport;
