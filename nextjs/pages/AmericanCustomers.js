import React from 'react';
import Sidebar from "../components/sidebar";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AmericanCustomers = ({ americanCustomers }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (americanCustomers && d3Container.current) {
            d3.select(d3Container.current).selectAll("*").remove();

            const svgWidth = d3Container.current.clientWidth || 960;
            const svgHeight = d3Container.current.clientHeight || 500;

            const margin = { top: 20, right: 30, bottom: 90, left: 90 },
                  width = svgWidth - margin.left - margin.right,
                  height = svgHeight - margin.top - margin.bottom;
    
            const svg = d3.select(d3Container.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
    
            const x = d3.scaleBand()
                .range([0, width])
                .domain(americanCustomers.map(d => d.city))
                .padding(0.1);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-35)");
              
    
            const y = d3.scaleLinear()
                .domain([0, d3.max(americanCustomers, d => d.customer_count)])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));
    
            svg.selectAll(".bar")
                .data(americanCustomers)
                .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.city))
                .attr("y", d => y(d.customer_count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.customer_count))
                .attr("fill", "#69b3a2");
        }
    }, [americanCustomers]);

    return (
        <div className="flex min-h-screen bg-gray-800">
            <Sidebar />
            <div className="flex-1 p-5 bg-gray-300">
                <div ref={d3Container} />
            </div>
        </div>
    );
};

export async function getServerSideProps() {
    const response = await fetch('http://fastapi:8000/getAmericanCustomers');
    const americanCustomers = await response.json();

    return { props: { americanCustomers } };
}


export default AmericanCustomers;
