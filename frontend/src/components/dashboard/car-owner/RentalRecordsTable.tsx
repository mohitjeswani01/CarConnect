import React from "react";
import { Badge } from "@/components/ui/badge";

export interface RentalRecord {
    id: number;
    carModel: string;
    renterId: string;
    renterName: string;
    startDate: string;
    endDate: string;
    status: string;
    hasDriver: boolean;
}

interface RentalRecordsTableProps {
    rentalRecords: RentalRecord[];
}

const RentalRecordsTable: React.FC<RentalRecordsTableProps> = ({ rentalRecords }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Car Model</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renter</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Driver</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {rentalRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium">{record.carModel}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm">{record.renterName}</div>
                                    <div className="text-xs text-gray-500">ID: {record.renterId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm">{record.startDate}</div>
                                    <div className="text-sm">to {record.endDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                        variant={
                                            record.status === "Active" ? "default" :
                                                record.status === "Upcoming" ? "outline" :
                                                    "secondary"
                                        }
                                    >
                                        {record.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {record.hasDriver ? "With Driver" : "No Driver"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RentalRecordsTable;
