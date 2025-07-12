import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaChartBar, FaCalendar } from 'react-icons/fa';
import axios from 'axios';
import Chart from 'react-apexcharts';
import './ReportStyles.css';

const Reports = () => {
    const [reportData, setReportData] = useState({
        tontines: [],
        transactions: [],
        stats: {}
    });
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('monthly');

    useEffect(() => {
        const fetchReportData = async() => {
            try {
                const response = await axios.get(`http://localhost:5050/api/reports`, {
                    params: {
                        start: dateRange.start,
                        end: dateRange.end,
                        type: reportType
                    }
                });
                setReportData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, [dateRange, reportType]);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: reportData.tontines.map(t => t.nom),
        },
        colors: ['#1976d2', '#4caf50']
    };

    const chartSeries = [{
            name: 'Montant Collecté',
            data: reportData.tontines.map(t => t.totalMontant)
        },
        {
            name: 'Nombre de Transactions',
            data: reportData.tontines.map(t => t.nombreTransactions)
        }
    ];

    const handleExport = (format) => {
        console.log(`Exporting ${format} report...`);
        // Implémentez l'export ici
    };

    if (loading) return <div className = "loading" > Génération du rapport... < /div>;

    return ( <
        div className = "reports-container" >
        <
        h1 > < FaChartBar / > Rapports et Statistiques < /h1>

        <
        div className = "report-controls" >
        <
        div className = "date-range" >
        <
        label >
        <
        FaCalendar / > Date de début:
        <
        input type = "date"
        value = { dateRange.start }
        onChange = {
            (e) => setDateRange({...dateRange, start: e.target.value })
        }
        />  <
        /label>  <
        label >
        <
        FaCalendar / > Date de fin:
        <
        input type = "date"
        value = { dateRange.end }
        onChange = {
            (e) => setDateRange({...dateRange, end: e.target.value })
        }
        />  <
        /label>  <
        /div>

        <
        div className = "report-type" >
        <
        label > Type de rapport: < /label>  <
        select value = { reportType }
        onChange = {
            (e) => setReportType(e.target.value)
        } >
        <
        option value = "monthly" > Mensuel <
        /option> <option value = "weekly" > Hebdomadaire  <
        /option>  <
        option value = "custom" > Personnalisé < /option>  <
        /select>  <
        /div>

        <
        div className = "export-buttons" >
        <
        button onClick = {
            () => handleExport('pdf')
        }
        className = "export-btn" >
        <
        FaFilePdf / > PDF < /button>  <
        button onClick = {
            () => handleExport('excel')
        }
        className = "export-btn" >
        <
        FaFileExcel / > Excel < /button>  <
        /div>  <
        /div>

        <
        div className = "stats-summary" >
        <
        div className = "stat-card" >
        <
        h3 > Total Collecté < /h3>  <
        p > { reportData.stats.totalMontant ? .toLocaleString() || 0 }
        FCFA < /p>  <
        /div>  <
        div className = "stat-card" >
        <
        h3 > Transactions < /h3>  <
        p > { reportData.stats.totalTransactions || 0 } < /p>  <
        /div>  <
        div className = "stat-card" >
        <
        h3 > Membres Actifs < /h3>  <
        p > { reportData.stats.activeMembers || 0 } < /p>  <
        /div>  <
        /div>

        <
        div className = "chart-container" >
        <
        Chart options = { chartOptions }
        series = { chartSeries }
        type = "bar"
        height = { 350 }
        />  <
        /div>

        <
        div className = "transactions-table" >
        <
        h3 > Dernières Transactions < /h3>  <
        table >
        <
        thead >
        <
        tr >
        <
        th > Date < /th> <
        th > Membre < /th>  <
        th > Tontine < /th>  <
        th > Montant < /th> <
        th > Type < /th>  <
        /tr>  <
        /thead>  <
        tbody > {
            reportData.transactions.slice(0, 5).map((txn, index) => ( <
                tr key = { index } >
                <
                td > { new Date(txn.date).toLocaleDateString() } < /td>  <
                td > { txn.membreNom } < /td>  <
                td > { txn.tontineNom } < /td>  <
                td > { txn.montant.toLocaleString() }
                FCFA < /td>  <
                td > { txn.type } < /td>  <
                /tr>
            ))
        } <
        /tbody>  <
        /table>  <
        /div>  <
        /div>
    );
};

export default Reports;