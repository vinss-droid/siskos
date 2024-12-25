'use client'

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Card,
    CardBody, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Input
} from "@nextui-org/react";
import {IconPencil, IconPlus, IconTrash} from "@tabler/icons-react";
import {createClient} from "@supabase/supabase-js";
import React from "react";
import {string} from "postcss-selector-parser";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabase = createClient(supabaseURL, supabaseKey);

type Notes = {
    id: number;
    nama: string;
    kamarId: number;
    kwhBulanIni: number | null;
    kwhBulanLalu: number | null;
    totalBiaya: number;
}

interface NewNote {
    nama: string,
    kamarId: number,
}

export default function AdminPage() {

    const modalAdd = useDisclosure();
    const [data, setData] = React.useState<Notes[] | null>()
    const [dataNew, setDataNew] = React.useState<NewNote>()

    const getNotes = async () => {
        const { data } = await supabase.from('catatan').select()
        setData(data)
    }

    const addNotes = async () => {
        const {error} = await supabase.from('catatan')
            .insert([{
                nama: dataNew?.nama,
                kamarId: dataNew?.kamarId,
            }])

        if (error) throw error
    }

    React.useEffect(() => {
        getNotes()
    }, [])

    return <>
        <div className="flex justify-center">
            <Card className="w-10/12 max-md:w-full">
                <CardBody>
                    <h3 className="text-3xl text-center font-bold my-4 max-md:text-xl">
                        Admin - Catatan Listrik Kos
                    </h3>
                    <Button color="primary" className="my-4" onPress={modalAdd.onOpen}>
                        <IconPlus color="white" /> Tambah Kamar
                    </Button>
                    <Table>
                        <TableHeader>
                        <TableColumn>Nama Penyewa</TableColumn>
                            <TableColumn>No.Kamar</TableColumn>
                            <TableColumn>Aksi</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No rows to display."}>
                            {data ? data.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell>{note.nama}</TableCell>
                                    <TableCell>{note.kamarId}</TableCell>
                                    <TableCell>
                                        <Button isIconOnly color="warning" className="me-2">
                                            <IconPencil color="white" />
                                        </Button>
                                        <Button isIconOnly color="danger">
                                            <IconTrash color="white" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : []}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>

    {/*  Modal Tambah  */}
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={modalAdd.isOpen}
            onOpenChange={modalAdd.onOpenChange}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Tambah Data Kamar</ModalHeader>
                <ModalBody>
                    <form>
                        <Input
                            isRequired
                            label="Nama Penyewa"
                            type="text"
                            required
                            className="mb-3"
                        />
                        <Input
                            isRequired
                            label="Nomor Kamar"
                            type="number"
                            required
                            className="mb-5"
                        />
                        <Button color="primary" className="mb-4 w-full" type="submit">
                            Simpan
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}
