import Layout from "../components/layout";
import React from 'react';
import { useTable, useSortBy } from 'react-table';
import Sidebar from "../components/sidebar";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AmericanCustomers = ({ americanCustomers }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (americanCustomers && d3Container.current) {
            const margin = { top: 20, right: 30, bottom: 40, left: 90 },
                  width = 460 - margin.left - margin.right,
                  height = 400 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .domain([0, d3.max(americanCustomers, d => d.customer_count)])
                .range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            const y = d3.scaleBand()
                .range([0, height])
                .domain(americanCustomers.map(d => d.city))
                .padding(.1);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll("myRect")
                .data(americanCustomers)
                .join("rect")
                .attr("x", x(0))
                .attr("y", d => y(d.city))
                .attr("width", d => x(d.customer_count))
                .attr("height", y.bandwidth())
                .attr("fill", "#69b3a2");
        }
    }, [americanCustomers]);
    return (
        <div className="flex min-h-screen bg-gray-800">
            <Sidebar />
            <div ref={d3Container} />
        </div>
    );
};

export async function getServerSideProps() {
    const response = await fetch('http://fastapi:8000/getAmericanCustomers');
    const americanCustomers = await response.json();

    return { props: { americanCustomers } };
}


export default AmericanCustomers;
