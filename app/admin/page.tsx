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
import React, {useState} from "react";
import {Bounce, toast} from "react-toastify";

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
    nama?: string,
    kamarId?: number,
}

interface DataKwh {
    id?: number;
    kamarId?: number | undefined;
    penyewa?: string | undefined;
    KWhBulanIni?: number | undefined;
    KWhBulanLalu?: number | undefined;
}

interface DataKamar {
    id?: number;
    kamarId?: number | undefined;
    penyewa?: string | undefined;
}

export default function AdminPage() {

    const modalAdd = useDisclosure();
    const modalEdit = useDisclosure();
    const modalDelete = useDisclosure();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = React.useState<Notes[] | null>()
    const [dataNew, setDataNew] = React.useState<NewNote>()
    const [dataKWh, setDataKWh] = React.useState<DataKwh>()
    const [dataKamar, setDataKamar] = React.useState<DataKamar>()

    const getNotes = async () => {
        const { data } = await supabase.from('catatan').select()
        setData(data)
    }

    const addNotes = async () => {
        setIsLoading(true)
        const {error} = await supabase.from('catatan')
            .insert({
                nama: dataNew?.nama,
                kamarId: dataNew?.kamarId,
            })

        if (error) toast.error('Error while inserting data.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        toast.success('Berhasil menambahkan data.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        setIsLoading(false)
        getNotes();
        modalAdd.onClose()
    }

    const updateKWh = async () => {
        setIsLoading(true)
        const id = dataKWh?.id ?? 0
        const {error} = await supabase.from('catatan')
            .update({
                kwhBulanIni: dataKWh?.KWhBulanIni,
                kwhBulanLalu: dataKWh?.KWhBulanLalu,
            })
            .eq('id', id)

        if (error) toast.error('Error while updating data.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        toast.success('Berhasil update KWh.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        setIsLoading(false)
        modalEdit.onClose()
    }

    const deleteKamar = async () => {
        setIsLoading(true)
        const id = dataKamar?.id ?? 0
        const {error} = await supabase.from('catatan')
            .delete()
            .eq('id', id)

        if (error) toast.error('Error while deleting data.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        toast.success('Berhasil hapus data kamar.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        setIsLoading(false)
        getNotes()
        modalDelete.onClose()
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
                                        <Button isIconOnly color="warning" className="me-2" onPress={() => {
                                            setDataKWh({
                                                ...dataKWh, id: note.id, kamarId: note.kamarId, penyewa: note.nama
                                            })
                                            modalEdit.onOpen()
                                        }}>
                                            <IconPencil color="white" />
                                        </Button>
                                        <Button isIconOnly color="danger" onPress={() => {
                                            setDataKamar({
                                                ...dataKWh, id: note.id, kamarId: note.kamarId, penyewa: note.nama
                                            })
                                            modalDelete.onOpen()
                                        }}>
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
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        addNotes()
                    }}>
                        <Input
                            isRequired
                            label="Nama Penyewa"
                            type="text"
                            required
                            className="mb-3"
                            onChange={(e) => setDataNew({
                                ...dataNew, nama: e.target.value
                            })}
                        />
                        <Input
                            isRequired
                            label="Nomor Kamar"
                            type="number"
                            required
                            className="mb-5"
                            onChange={(e) => setDataNew({
                                ...dataNew, kamarId: parseInt(e.target.value)
                            })}
                        />
                        <Button color="primary" className="mb-4 w-full" type="submit" isLoading={isLoading}>
                            Simpan
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>

        {/*  Modal Edit  */}
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={modalEdit.isOpen}
            onOpenChange={modalEdit.onOpenChange}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update KWh Kamar | {`${dataKWh?.penyewa} Kamar No.${dataKWh?.kamarId}`}</ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        updateKWh()
                    }}>
                        <Input
                            isRequired
                            label="KWh Bulan Lalu"
                            type="number"
                            required
                            className="mb-3"
                            onChange={(e) => setDataKWh({
                                ...dataKWh, KWhBulanLalu: parseInt(e.target.value)
                            })}
                        />
                        <Input
                            isRequired
                            label="KWh Bulan Ini"
                            type="number"
                            required
                            className="mb-5"
                            onChange={(e) => setDataKWh({
                                ...dataKWh, KWhBulanIni: parseInt(e.target.value)
                            })}
                        />
                        <Button color="primary" className="mb-4 w-full" type="submit" isLoading={isLoading}>
                            Simpan
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>


        {/*  Modal Delete  */}
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={modalDelete.isOpen}
            onOpenChange={modalDelete.onOpenChange}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Hapus Data | {`${dataKamar?.penyewa} Kamar No.${dataKamar?.kamarId}`}</ModalHeader>
                <ModalBody>
                    <Button color="danger" className="mb-4 w-full" type="button" onPress={deleteKamar} isLoading={isLoading}>
                        Hapus
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}
