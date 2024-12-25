'use client'

import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider} from "@nextui-org/react";
import {createClient} from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabase = createClient(supabaseURL, supabaseKey);
const biayaAir: number = 30000;

type Notes = {
    id: number;
    nama: string;
    kamarId: number;
    kwhBulanIni: number | null;
    kwhBulanLalu: number | null;
    totalBiaya: number;
}

export default function HomePage () {

    const [data, setData] = React.useState<Notes[] | null>()

    const getNotes = async () => {
        const { data } = await supabase.from('catatan').select()
        setData(data)
    }

    React.useEffect(() => {
        getNotes()
    }, [])

    return <>
        <h1 className="text-3xl text-center font-bold max-md:text-xl mb-16 max-md:mb-10">Catatan Listrik Kos</h1>
        <div className="flex flex-wrap justify-center max-md:flex-col gap-3 max-md:px-4">
            {data?.map((note) => (
                <Card className="w-3/12 max-md:w-full px-2" key={note.id}>
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-large font-bold uppercase">{note.nama}</p>
                            <p className="text-small text-default-500">Kamar No.{note.kamarId}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <table className="leading-8">
                            <tbody>
                            <tr>
                                <td className="font-medium text-left">KWh Bulan Ini</td>
                                <td>:</td>
                                <td>{note.kwhBulanIni ?? 0}</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-left">KWh Bulan Lalu</td>
                                <td className="font-medium text-left">:</td>
                                <td>{note.kwhBulanLalu ?? 0}</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-left">Pengurangan KWh</td>
                                <td className="font-medium text-left">:</td>
                                <td>{(note.kwhBulanIni ?? 0) - (note.kwhBulanLalu ?? 0)}</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-left">Biaya Air</td>
                                <td className="font-medium text-left">:</td>
                                <td>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    }).format(biayaAir)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                        <h3 className="text-xl font-semibold text-red-500"> Total Biaya : {' '}
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                            }).format(((note.kwhBulanIni ?? 0) - (note.kwhBulanLalu ?? 0)) * 3 + biayaAir)}
                        </h3>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </>
}