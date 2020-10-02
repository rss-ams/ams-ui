import React from 'react'
import FarmInfoTable from "./FarmInfoTable"
import FieldInfoTable2 from './FieldInfoTable2'
import FieldInfoTable3 from './FieldInfoTable3'


export default {
    title: 'Organisms/FarmInfoTable',
    component: FarmInfoTable
}

export const FarmInfo = () => <FarmInfoTable></FarmInfoTable>
export const Upcoming = () => <FieldInfoTable2></FieldInfoTable2>
export const Past = () => <FieldInfoTable3></FieldInfoTable3>