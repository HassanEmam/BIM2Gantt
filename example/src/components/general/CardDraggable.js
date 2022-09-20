import React, { useRef } from "react";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardDraggable = (props) => {
	const { visible, handleClose, title, handle } = props;
	const draggableRef = useRef(null);
	const style = () => {
		return {
			display: visible ? "block" : "none",
			top: "5%",
			left: "5%",
		};
	};
	return (
		<>
			<Draggable handle={"#" + handle}>
				<div className="card modelBrowser" style={style()} ref={draggableRef}>
					<div className="card-header" id={handle}>
						<div className="d-flex justify-content-between">
							{title}
							<div className="d-flex justify-content-end">
								<div>
									<button className="btn close-content" onClick={handleClose}>
										<FontAwesomeIcon icon={["fa-solid", "fa-window-close"]} size="xs" />
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="card-body">{props.children}</div>
				</div>
			</Draggable>
		</>
	);
};

export default CardDraggable;
