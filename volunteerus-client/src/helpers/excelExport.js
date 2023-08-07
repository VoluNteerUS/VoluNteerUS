import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportExcel = (groups, eventName) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Grouping Data");

    // Add header row
    const header = ["Group Number", "Full Name", "Email", "Phone Number", "Telegram Handle"];
    worksheet.addRow(header);

    // Add data in rows
    groups.forEach((group) => {
        group.members.forEach((member) => {
            const row = [];
            row.push(group.number);
            row.push(member.full_name);
            row.push(member.email);
            row.push(member.phone_number);
            row.push(member.telegram_handle);
            worksheet.addRow(row);
        });
    });

    // Add buffer
    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `${eventName} Groupings.xlsx`);
    });
}