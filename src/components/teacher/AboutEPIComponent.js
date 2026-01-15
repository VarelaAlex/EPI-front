import {ClusterOutlined, EllipsisOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {Button, Card, Collapse, Flex, Image, Popover, Table, Tabs, Typography} from "antd";
import React, {useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import "../assets/styles/nestedList.css";

const AboutEPI = () => {
    const {t} = useTranslation();
    let fontSize = "16px";

    const [activeTabKey, setActiveTabKey] = useState("1");

    const nivelesData = [{
        key: "1",
        red: t("aboutEPI.levels.iconic"),
        "I-I": t("aboutEPI.levels.age.3"),
        "I-II": t("aboutEPI.levels.age.3-4"),
        "I-III": t("aboutEPI.levels.age.4")
    }, {
        key: "2",
        red: t("aboutEPI.levels.combined"),
        "I-I": t("aboutEPI.levels.age.5"),
        "I-II": t("aboutEPI.levels.age.5-6"),
        "I-III": t("aboutEPI.levels.age.6")
    }, {
        key: "3",
        red: t("aboutEPI.levels.symbolic"),
        "I-I": t("aboutEPI.levels.age.7"),
        "I-II": t("aboutEPI.levels.age.7-8"),
        "I-III": t("aboutEPI.levels.age.8")
    }];

    const getColor = (value) => {
        const colors = {
            [t("aboutEPI.levels.age.3")]: "rgb(0, 210, 0)",
            [t("aboutEPI.levels.age.3-4")]: "rgb(0, 180, 0)",
            [t("aboutEPI.levels.age.4")]: "rgb(0, 150, 0)",
            [t("aboutEPI.levels.age.5")]: "rgb(210, 210, 0)",
            [t("aboutEPI.levels.age.5-6")]: "rgb(180, 180, 0)",
            [t("aboutEPI.levels.age.6")]: "rgb(150, 150, 0)",
            [t("aboutEPI.levels.age.7")]: "rgb(240, 0, 0)",
            [t("aboutEPI.levels.age.7-8")]: "rgb(200, 0, 0)",
            [t("aboutEPI.levels.age.8")]: "rgb(150, 0, 0)"
        };
        return colors[value];
    };

    const columns = [{title: "", dataIndex: "red", key: "red", render: text => <b>{text}</b>}, {
        title: t("aboutEPI.levels.network.i-i"),
        dataIndex: "I-I",
        key: "I-I",
        render: text => <span style={{color: getColor(text)}}>{text}</span>
    }, {
        title: t("aboutEPI.levels.network.i-ii"),
        dataIndex: "I-II",
        key: "I-II",
        render: text => <span style={{color: getColor(text)}}>{text}</span>
    }, {
        title: t("aboutEPI.levels.network.i-iii"),
        dataIndex: "I-III",
        key: "I-III",
        render: text => <span style={{color: getColor(text)}}>{text}</span>
    }];

    const imagesLinearText = [{
        src: "TextoLineal1-1Iconica.png",
        title: t("aboutEPI.linearText.types.iconic"),
        description: t("aboutEPI.linearText.images.iconic")
    }, {
        src: "TextoLineal1-2Combinada.png",
        title: t("aboutEPI.linearText.types.combined"),
        description: t("aboutEPI.linearText.images.combined")
    }, {
        src: "TextoLineal1-3Simbolica.png",
        title: t("aboutEPI.linearText.types.symbolic"),
        description: t("aboutEPI.linearText.images.symbolic")
    }];

    const imagesHypertext = [{
        src: "Hypertexto1-1Iconica.png",
        title: t("aboutEPI.levels.network.i-i"),
        description: <Trans
            i18nKey="aboutEPI.hypertexto.images.i-i"
            components={{
                italic: <i/>
            }}
        />
    }, {
        src: "Hypertexto1-2Combinada.png",
        title: t("aboutEPI.levels.network.i-ii"),
        description: <Trans
            i18nKey="aboutEPI.hypertexto.images.i-ii"
            components={{
                italic: <i/>
            }}
        />
    }, {
        src: "Hypertexto1-3Simbolica.png",
        title: t("aboutEPI.levels.network.i-iii"),
        description: <Trans
            i18nKey="aboutEPI.hypertexto.images.i-iii"
            components={{
                italic: <i/>
            }}
        />
    }];

    const imagesMarks = [{
        src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${8289}`,
        title: t("aboutEPI.punctuation.stop.title"),
        description: t("aboutEPI.punctuation.stop.description")
    }];

    const {Title, Paragraph, Text} = Typography;
    const {Meta} = Card;
    let {PreviewGroup} = Image;

    const handleHypertextoClick = () => {
        setActiveTabKey("2");
    };

    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const hide = () => {
        setClicked(false);
        setHovered(false);
    };
    const handleHoverChange = (open) => {
        setHovered(open);
        setClicked(false);
    };
    const handleClickChange = (open) => {
        setHovered(false);
        setClicked(open);
    };
    let content = <Image
        alt={t("aboutEPI.hypertexto.pictograms.alt")}
        src={"/images/Pictogramas.png"}
        height="14vmax"
    />;

    const tabItems = [{
        key: "1", icon: <UnorderedListOutlined/>, label: t("aboutEPI.tabs.linearText"), children: (<>
            <Paragraph style={{fontSize}}>
                {t("aboutEPI.linearText.intro")}
            </Paragraph>
            <ol style={{fontSize}}>
                <li>
                    <b>{t("aboutEPI.linearText.types.iconic")}:</b> {t("aboutEPI.linearText.description.iconic")}
                </li>
                <li>
                    <b>{t("aboutEPI.linearText.types.combined")}:</b> {t("aboutEPI.linearText.description.combined")}
                </li>
                <li>
                    <b>{t("aboutEPI.linearText.types.symbolic")}:</b> {t("aboutEPI.linearText.description.symbolic")}
                </li>
            </ol>
            <Paragraph style={{fontSize}}>
                {t("aboutEPI.linearText.explanation.part1")}{" "}
                <Text
                    strong
                    underline
                    onClick={handleHypertextoClick}
                    style={{
                        fontSize, cursor: "pointer", color: "#1890ff"
                    }}
                ><Trans
                    i18nKey="aboutEPI.tabs.hypertexto"
                    components={{
                        italic: <i/>
                    }}
                />
                </Text>
                {t("aboutEPI.linearText.explanation.part2")}
            </Paragraph>
            <Flex justify="center" wrap gap="large">
                <PreviewGroup>
                    {imagesLinearText.map((image, index) => (<Card
                        hoverable
                        key={index}
                        cover={<Image alt={image.description} src={`/images/${image.src}`} height="15vmax"/>}
                    >
                        <Meta title={image.title} description={image.description}/>
                    </Card>))}
                </PreviewGroup>
            </Flex>
        </>)
    }, {
        key: "2", icon: <ClusterOutlined/>, label: <Trans
            i18nKey="aboutEPI.tabs.hypertexto"
            components={{
                italic: <i/>
            }}
        />, children: (<>
            <Paragraph style={{fontSize}}>
                <Trans
                    i18nKey="aboutEPI.hypertexto.intro"
                    components={{
                        italic: <i/>
                    }}
                />
            </Paragraph>
            <ol style={{fontSize}}>
                <li>
                    <b>{t("aboutEPI.levels.network.i-i")}</b>
                </li>
                <li>
                    <b>{t("aboutEPI.levels.network.i-ii")}</b>
                </li>
                <li>
                    <b>{t("aboutEPI.levels.network.i-iii")}</b>
                </li>
            </ol>
            <Paragraph style={{fontSize}}>
                {t("aboutEPI.hypertexto.organization.part1")}{" "}
                <Popover
                    style={{width: 500}}
                    content={content}
                    title={t("aboutEPI.hypertexto.pictograms.title")}
                    trigger="hover"
                    open={hovered}
                    onOpenChange={handleHoverChange}
                >
                    <Popover
                        content={<Flex vertical align="end" gap={15}>
                            {content}
                            <Text
                                style={{
                                    fontSize, cursor: "pointer", color: "#1890ff"
                                }}
                                onClick={hide}
                            >
                                {t("aboutEPI.hypertexto.pictograms.close")}
                            </Text>
                        </Flex>}
                        title={t("aboutEPI.hypertexto.pictograms.title")}
                        trigger="click"
                        open={clicked}
                        onOpenChange={handleClickChange}
                    >
                        <Button>{t("aboutEPI.hypertexto.pictograms.button")}</Button>
                    </Popover>
                </Popover>{" "}
                {t("aboutEPI.hypertexto.organization.part2")}
            </Paragraph>
            <Flex justify="center" wrap gap="large">
                <PreviewGroup>
                    {imagesHypertext.map((image, index) => (<Card
                        hoverable
                        key={index}
                        cover={<Image alt={image.description} src={`/images/${image.src}`} height="14vmax"/>}
                    >
                        <Meta title={image.title} description={image.description}/>
                    </Card>))}
                </PreviewGroup>
            </Flex>
        </>)
    }, {
        key: "3", icon: <EllipsisOutlined/>, label: t("aboutEPI.tabs.punctuation"), children: (<>
            <Paragraph style={{fontSize}}>
                {t("aboutEPI.punctuation.intro")}
            </Paragraph>
            <Flex justify="center" align="center" style={{width: "100%"}}>
                <PreviewGroup>
                    {imagesMarks.map((image, index) => (<Card
                        hoverable
                        key={index}
                        cover={<div style={{
                            display: "flex", justifyContent: "center", padding: "10px"
                        }}>
                            <Image alt={image.description} src={image.src} width="6vmax"/>
                        </div>}
                    >
                        <Meta
                            title={image.title}
                            description={image.description}
                            style={{
                                wordWrap: "break-word", whiteSpace: "normal", maxWidth: "400px"
                            }}
                        />
                    </Card>))}
                </PreviewGroup>
            </Flex>
        </>)
    }];

    const collapseItems = [{
        key: "1", label: <Trans
            i18nKey="aboutEPI.collapse.mainComponents"
            components={{
                italic: <i/>
            }}
        />, children: (<Tabs activeKey={activeTabKey} onChange={setActiveTabKey} type="card" size="large"
                             items={tabItems}/>)
    }, {
        key: "2", label: <Trans
            i18nKey="aboutEPI.collapse.hypertextLevels"
            components={{
                italic: <i/>
            }}
        />, children: (<>
            <div style={{paddingBottom: "10px"}}>
                {t("aboutEPI.levels.intro")}
            </div>
            <Table columns={columns} dataSource={nivelesData} pagination={false} bordered/>
        </>)
    }, {
        key: "3", label: t("aboutEPI.collapse.exercisePhases"), children: (<>
            {t("aboutEPI.phases.intro")}
            <ol className="outer-list">
                <li>
                    <strong>{t("aboutEPI.phases.first.title")}:</strong>
                    <br/>
                    {t("aboutEPI.phases.first.description")}
                    <ol className="sub-list">
                        <li>
                            <i>{t("aboutEPI.phases.first.read.title")}:</i> {t("aboutEPI.phases.first.read.description")}
                        </li>
                        <li>
                            <i>{t("aboutEPI.phases.first.order.title")}:</i> {t("aboutEPI.phases.first.order.description")}
                        </li>
                    </ol>
                </li>
                <li>
                    <strong>{t("aboutEPI.phases.second.title")}:</strong>
                    <br/>
                    {t("aboutEPI.phases.second.description")}
                    <ol className="sub-list">
                        <li>
                            <i>{t("aboutEPI.phases.second.express.title")}:</i>
                            <Trans
                                i18nKey="aboutEPI.phases.second.express.description"
                                components={{
                                    italic: <i/>
                                }}
                            />
                        </li>
                    </ol>
                </li>
            </ol>
            {t("aboutEPI.phases.conclusion")}
        </>)
    }];

    return (<Card style={{margin: "20px", width: "80%"}}>
        <Title><Trans
            i18nKey="aboutEPI.title"
            components={{
                italic: <i/>
            }}
        /></Title>
        <Paragraph style={{fontSize}}>
            <Trans
                i18nKey="aboutEPI.description"
                components={{
                    italic: <i/>
                }}
            />
        </Paragraph>
        <Collapse items={collapseItems} size="large" accordion/>
    </Card>);
};

export default AboutEPI;