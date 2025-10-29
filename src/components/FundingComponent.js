import React from "react";
import {Card, Flex, Image, Typography} from "antd";
import {useTranslation} from 'react-i18next';

const {Paragraph, Text} = Typography;

const Funding = () => {

    let {t} = useTranslation();
    let images = [
        {src: "/images/ministerio.png", alt: "Ministerio de Ciencia, Innovación y Universidades"},
        {src: "/images/UE.png", alt: "Cofinanciado por la UE"},
        {src: "/images/agencia-investigacion.png", alt: "Agencia Estatal de Investigación"},
        {src: "/images/adir.png", alt: "ADIR"}
    ]

    return (<Card
        title={t("funding.title")}
        style={{width: "80%"}}
    >
        <Paragraph style={{ textAlign: "center", fontSize: 16 }}>{t("funding.body")}</Paragraph>
        <Paragraph strong style={{ textAlign: "center",  fontSize: 20 }}>{t("funding.code")}</Paragraph>
        <Flex gap="large" style={{marginTop: "2vh"}} wrap>
            {images.map((img) => (<Image
                    src={img.src}
                    preview={false}
                    alt={img.alt}
                    style={{maxHeight: 80}}
                />))}
        </Flex>
    </Card>);
};

export default Funding;
