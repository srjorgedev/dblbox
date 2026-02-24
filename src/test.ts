import Database from "@/config/db";
import path from "node:path";
import "dotenv/config";

import * as Services from "@/v1/domain/services";
import * as Repositories from "@/v1/domain/repositories";

import { UnitQueries } from "@/v1/queries/unit.query";
import { NameActionRequiered, UnitNameUpdate } from "./types/unit.types";
import { insertQueryBuilder } from "./utils/unit.util";

async function main() {
    const DB = process.env.DATABASE;
    const CDB = process.env.COMMUNITY_DB;

    const DB_URL = `file:${path.join(process.cwd(), DB)}`;
    const C_DB_URL = `file:${path.join(process.cwd(), CDB)}`;

    const dblDB = new Database(DB_URL).getConnection();
    const cDB = new Database(C_DB_URL).getConnection();

    const basic = new Repositories.UnitBasicRepo(dblDB);
    const color = new Repositories.UnitColorRepo(dblDB);

    console.log("Runing test file");

    //const r = await basic.insertSingle({ _id: "ASDaSD", _num: 54810, chapter: 1, fusion: false, lf: false, rarity: 1, tagswitch: false, transform: false, type: 1, zenkai: false });
    // const p = await basic.deleteSingle({unit_id: "ASDaSD"})
    // console.log({p})

    const asd = insertQueryBuilder("unit_color");
    console.log(asd)
    
    // const r = color.insertSingle({color: 1, number: 2, unit: "DBL92-01L"})
    // console.log({r})

}

main();