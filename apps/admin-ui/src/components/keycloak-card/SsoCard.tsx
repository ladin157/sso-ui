import { ReactElement, useState } from "react";
import {
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  CardFooter,
  Dropdown,
  KebabToggle,
  Label,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import "./sso-card.css";
import { useRouteMatch } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import { ClickableCard } from "./ClickableCard";

export type SsoCardProps = {
  id: string;
  title: string;
  dropdownItems?: ReactElement[];
  labelText?: string;
  labelColor?: any;
  footerText?: string;
  configEnabled?: boolean;
  providerId?: string;
};

export const SsoCard = ({
  id,
  title,
  dropdownItems,
  labelText,
  labelColor,
  footerText,
  providerId,
}: SsoCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { url } = useRouteMatch();

  const onDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCardMenuClick = (e: any) => {
    e.stopPropagation();
  };

  const openSettings = () => {
    navigate(`${url}/${providerId}/${id}`);
  };

  return (
    <ClickableCard isSelectable onClick={openSettings}>
      <CardHeader>
        <CardActions>
          {dropdownItems && (
            <Dropdown
              data-testid={`${title}-dropdown`}
              isPlain
              position={"right"}
              toggle={<KebabToggle onToggle={onDropdownToggle} />}
              onClick={(e) => handleCardMenuClick(e)}
              isOpen={isDropdownOpen}
              dropdownItems={dropdownItems}
            />
          )}
        </CardActions>
        <CardTitle data-testid="sso-card-title">{title}</CardTitle>
      </CardHeader>
      <CardBody />
      <CardFooter>
        <Flex>
          <FlexItem className="sso--sso-card__footer">
            {footerText && footerText}
          </FlexItem>
          <FlexItem>
            {labelText && (
              <Label color={labelColor || "gray"}>{labelText}</Label>
            )}
          </FlexItem>
        </Flex>
      </CardFooter>
    </ClickableCard>
  );
};
